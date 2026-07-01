import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function resolveEmployeeRole(invitationRole: string, employeeRole: unknown) {
  if (invitationRole === "admin") {
    return "admin";
  }

  if (
    typeof employeeRole !== "string" ||
    !["doctor", "reception", "auxiliary"].includes(employeeRole)
  ) {
    return null;
  }

  return employeeRole;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return Response.json(
      { error: "Supabase is not configured" },
      { status: 500, headers: corsHeaders },
    );
  }

  const authorization = req.headers.get("Authorization") ?? "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: authData, error: authError } = await userClient.auth.getUser();

  if (authError || !authData.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders },
    );
  }

  const { token, action, employeeRole, specialty, color } = await req.json();

  if (!token || typeof token !== "string") {
    return Response.json(
      { error: "Token is required" },
      { status: 400, headers: corsHeaders },
    );
  }

  const resolvedAction = action === "reject" ? "reject" : "accept";

  const { data: invitation, error: invitationError } = await adminClient
    .from("invitation_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (invitationError || !invitation) {
    return Response.json(
      { error: "Invitation not found" },
      { status: 404, headers: corsHeaders },
    );
  }

  if (invitation.used_at) {
    return Response.json(
      { error: "Invitation already used" },
      { status: 400, headers: corsHeaders },
    );
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return Response.json(
      { error: "Invitation expired" },
      { status: 400, headers: corsHeaders },
    );
  }

  if (
    normalizeEmail(authData.user.email) !== normalizeEmail(invitation.email)
  ) {
    return Response.json(
      { error: "Email does not match invitation" },
      { status: 403, headers: corsHeaders },
    );
  }

  if (resolvedAction === "reject") {
    const { error: rejectError } = await adminClient
      .from("invitation_tokens")
      .update({ used_at: new Date().toISOString(), used_by: authData.user.id })
      .eq("id", invitation.id);

    if (rejectError) {
      return Response.json(
        { error: rejectError.message },
        { status: 400, headers: corsHeaders },
      );
    }

    return Response.json({ rejected: true }, { headers: corsHeaders });
  }

  const { data: existingMemberships, error: membershipsError } =
    await adminClient
      .from("clinic_memberships")
      .select("id, role, clinic_id")
      .eq("user_id", authData.user.id)
      .eq("status", "active");

  if (membershipsError) {
    return Response.json(
      { error: membershipsError.message },
      { status: 400, headers: corsHeaders },
    );
  }

  const memberships = existingMemberships ?? [];

  if (
    memberships.some(
      (membership) => membership.clinic_id === invitation.clinic_id,
    )
  ) {
    return Response.json(
      { error: "Already a member of this clinic" },
      { status: 400, headers: corsHeaders },
    );
  }

  if (invitation.role !== "external" && memberships.length > 0) {
    return Response.json(
      { error: "User already belongs to a clinic" },
      { status: 400, headers: corsHeaders },
    );
  }

  if (memberships.some((membership) => membership.role === "owner")) {
    return Response.json(
      { error: "Owners cannot join other clinics" },
      { status: 400, headers: corsHeaders },
    );
  }

  const fullName =
    (authData.user.user_metadata?.full_name as string | undefined) ??
    authData.user.email.split("@")[0] ??
    "Empleado";

  const operationalRole = resolveEmployeeRole(invitation.role, employeeRole);

  if (!operationalRole) {
    return Response.json(
      { error: "Employee role is required" },
      { status: 400, headers: corsHeaders },
    );
  }

  const { error: membershipError } = await adminClient
    .from("clinic_memberships")
    .insert({
      user_id: authData.user.id,
      clinic_id: invitation.clinic_id,
      role: invitation.role,
      status: "active",
      invited_by: invitation.created_by,
      joined_at: new Date().toISOString(),
    });

  if (membershipError) {
    return Response.json(
      { error: membershipError.message },
      { status: 400, headers: corsHeaders },
    );
  }

  if (memberships.length === 0) {
    const { error: employeeError } = await adminClient.from("employees").upsert(
      {
        id: authData.user.id,
        clinic_id: invitation.clinic_id,
        full_name: fullName,
        role: operationalRole,
        specialty:
          typeof specialty === "string" && specialty.trim()
            ? specialty.trim()
            : null,
        color: typeof color === "string" && color.trim() ? color.trim() : null,
        active: true,
      },
      { onConflict: "id" },
    );

    if (employeeError) {
      return Response.json(
        { error: employeeError.message },
        { status: 400, headers: corsHeaders },
      );
    }
  }

  const { error: tokenError } = await adminClient
    .from("invitation_tokens")
    .update({ used_at: new Date().toISOString(), used_by: authData.user.id })
    .eq("id", invitation.id);

  if (tokenError) {
    return Response.json(
      { error: tokenError.message },
      { status: 400, headers: corsHeaders },
    );
  }

  return Response.json(
    { clinicId: invitation.clinic_id, role: invitation.role },
    { headers: corsHeaders },
  );
});
