import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const errorMessages: Record<string, string> = {
  invitation_not_found: "Invitation not found",
  invitation_already_used: "Invitation already used",
  invitation_expired: "Invitation expired",
  invitation_email_mismatch: "Email does not match invitation",
  already_member_of_clinic: "Already a member of this clinic",
  owner_cannot_join_other_clinics: "Owners cannot join other clinics",
  invitation_account_type_conflict:
    "Invitation role conflicts with the global account type",
  user_already_belongs_to_clinic: "User already belongs to a clinic",
  employee_role_required: "Employee role is required",
};

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status, headers: corsHeaders });
}

function resolveRpcError(message: string) {
  const match = Object.entries(errorMessages).find(([code]) =>
    message.includes(code),
  );

  return match?.[1] ?? "Invitation could not be processed";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return errorResponse("Supabase is not configured", 500);
  }

  const authorization = req.headers.get("Authorization") ?? "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: authData, error: authError } = await userClient.auth.getUser();

  if (authError || !authData.user?.email) {
    return errorResponse("Unauthorized", 401);
  }

  const body = await req.json().catch(() => null);
  const token = body?.token;
  const action = body?.action === "reject" ? "reject" : "accept";

  if (!token || typeof token !== "string") {
    return errorResponse("Token is required", 400);
  }

  const fullName =
    typeof authData.user.user_metadata?.full_name === "string"
      ? authData.user.user_metadata.full_name
      : (authData.user.email.split("@")[0] ?? "Empleado");

  const { data, error } = await adminClient.rpc("consume_employee_invitation", {
    p_token: token,
    p_user_id: authData.user.id,
    p_user_email: authData.user.email,
    p_action: action,
    p_full_name: fullName,
    p_employee_role:
      typeof body?.employeeRole === "string" ? body.employeeRole : null,
    p_specialty: typeof body?.specialty === "string" ? body.specialty : null,
    p_color: typeof body?.color === "string" ? body.color : null,
  });

  if (error) {
    const status = error.message.includes("invitation_email_mismatch")
      ? 403
      : error.message.includes("invitation_not_found")
        ? 404
        : 400;
    return errorResponse(resolveRpcError(error.message), status);
  }

  return Response.json(data, { headers: corsHeaders });
});
