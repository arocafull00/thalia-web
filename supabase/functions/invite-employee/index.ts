import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const AUTH_USERS_PAGE_SIZE = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITATION_TTL_DAYS = 7;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function errorResponse(code: string, error: string, status: number) {
  return Response.json({ code, error }, { status, headers: corsHeaders });
}

async function findUserByEmail(
  adminClient: ReturnType<typeof createClient>,
  email: string,
) {
  let page = 1;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: AUTH_USERS_PAGE_SIZE,
    });

    if (error) throw error;

    const user = data.users.find(
      (candidate) => candidate.email?.trim().toLowerCase() === email,
    );

    if (user) return user;
    if (!data.nextPage) return null;

    page = data.nextPage;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return errorResponse(
      "configuration_error",
      "Supabase is not configured",
      500,
    );
  }

  const authorization = req.headers.get("Authorization") ?? "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: authData, error: authError } = await userClient.auth.getUser();

  if (authError || !authData.user) {
    return errorResponse("unauthorized", "Unauthorized", 401);
  }

  const body = await req.json().catch(() => null);
  const clinicId = body?.clinicId;
  const action = body?.action ?? "create";

  if (!clinicId || typeof clinicId !== "string") {
    return errorResponse("clinic_id_required", "clinicId is required", 400);
  }

  const { data: requesterMembership, error: requesterError } = await adminClient
    .from("clinic_memberships")
    .select("clinic_id, role")
    .eq("user_id", authData.user.id)
    .eq("clinic_id", clinicId)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
    .maybeSingle();

  if (requesterError || !requesterMembership) {
    return errorResponse("forbidden", "Forbidden", 403);
  }

  if (action === "cancel") {
    if (!body?.invitationId || typeof body.invitationId !== "string") {
      return errorResponse(
        "invitation_id_required",
        "invitationId is required",
        400,
      );
    }

    const { error } = await adminClient.rpc(
      "cancel_pending_employee_invitation",
      {
        p_invitation_id: body.invitationId,
        p_clinic_id: clinicId,
      },
    );

    if (error) {
      const notPending = error.message.includes("invitation_not_pending");
      return errorResponse(
        notPending ? "invitation_not_pending" : "invitation_cancel_failed",
        notPending ? "Invitation is not pending" : "Invitation cancel failed",
        notPending ? 409 : 500,
      );
    }

    return Response.json({ cancelled: true }, { headers: corsHeaders });
  }

  if (action !== "create" && action !== "replace") {
    return errorResponse("invalid_action", "Invalid action", 400);
  }

  const email = body?.email;
  const role = body?.role;

  if (!email || typeof email !== "string" || !email.trim()) {
    return errorResponse("email_required", "Email is required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return errorResponse("invalid_email", "Invalid email", 400);
  }

  if (!role || !["admin", "employee", "external"].includes(role)) {
    return errorResponse("invalid_role", "Invalid role", 400);
  }

  let invitedUser;

  try {
    invitedUser = await findUserByEmail(adminClient, normalizedEmail);
  } catch {
    return errorResponse("auth_lookup_failed", "User lookup failed", 500);
  }

  if (!invitedUser) {
    return errorResponse(
      "user_not_found",
      "No existe un usuario con ese email en el sistema",
      404,
    );
  }

  const { data: existingMembership, error: membershipError } = await adminClient
    .from("clinic_memberships")
    .select("id")
    .eq("user_id", invitedUser.id)
    .eq("clinic_id", clinicId)
    .maybeSingle();

  if (membershipError) {
    return errorResponse(
      "membership_lookup_failed",
      "Membership lookup failed",
      500,
    );
  }

  if (existingMembership) {
    return errorResponse(
      "user_already_member",
      "Este usuario ya pertenece a la clínica",
      409,
    );
  }

  const expiresAt = new Date(
    Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  if (action === "replace") {
    if (!body?.invitationId || typeof body.invitationId !== "string") {
      return errorResponse(
        "invitation_id_required",
        "invitationId is required",
        400,
      );
    }

    const { data: invitation, error } = await adminClient.rpc(
      "replace_pending_employee_invitation",
      {
        p_invitation_id: body.invitationId,
        p_clinic_id: clinicId,
        p_email: normalizedEmail,
        p_role: role,
        p_created_by: authData.user.id,
        p_expires_at: expiresAt.toISOString(),
      },
    );

    if (error || !invitation) {
      const code = error?.message.includes("invitation_already_pending")
        ? "invitation_already_pending"
        : error?.message.includes("invitation_not_pending")
          ? "invitation_not_pending"
          : "invitation_replace_failed";
      const status = code === "invitation_replace_failed" ? 500 : 409;
      return errorResponse(code, error?.message ?? "Invitation failed", status);
    }

    return Response.json(invitation, { headers: corsHeaders });
  }

  const { data: pendingInvitation, error: pendingInvitationError } =
    await adminClient
      .from("invitation_tokens")
      .select("id")
      .eq("clinic_id", clinicId)
      .ilike("email", normalizedEmail)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

  if (pendingInvitationError) {
    return errorResponse(
      "invitation_lookup_failed",
      "Invitation lookup failed",
      500,
    );
  }

  if (pendingInvitation) {
    return errorResponse(
      "invitation_already_pending",
      "Este usuario ya tiene una invitación pendiente",
      409,
    );
  }

  const { data: invitation, error: inviteError } = await adminClient
    .from("invitation_tokens")
    .insert({
      clinic_id: clinicId,
      role,
      email: normalizedEmail,
      created_by: authData.user.id,
      expires_at: expiresAt.toISOString(),
    })
    .select("id, email, role, created_at, expires_at")
    .single();

  if (inviteError || !invitation) {
    return errorResponse("invitation_failed", "Invitation failed", 500);
  }

  return Response.json(invitation, { headers: corsHeaders });
});
