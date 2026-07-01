import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

  if (authError || !authData.user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders },
    );
  }

  const { data: requesterMembership, error: requesterError } = await adminClient
    .from("clinic_memberships")
    .select("clinic_id, role")
    .eq("user_id", authData.user.id)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
    .maybeSingle();

  if (requesterError || !requesterMembership) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403, headers: corsHeaders },
    );
  }

  const { email, role } = await req.json();
  const clinicId = requesterMembership.clinic_id;

  if (!email || typeof email !== "string" || !email.trim()) {
    return Response.json(
      { error: "Email is required" },
      { status: 400, headers: corsHeaders },
    );
  }

  if (!role || !["admin", "employee", "external"].includes(role)) {
    return Response.json(
      { error: "Invalid role" },
      { status: 400, headers: corsHeaders },
    );
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data: invitation, error: inviteError } = await adminClient
    .from("invitation_tokens")
    .insert({
      clinic_id: clinicId,
      role,
      email: email.trim().toLowerCase(),
      created_by: authData.user.id,
      expires_at: expiresAt.toISOString(),
    })
    .select("token, email, role, expires_at")
    .single();

  if (inviteError || !invitation) {
    return Response.json(
      { error: inviteError?.message ?? "Invitation failed" },
      { status: 400, headers: corsHeaders },
    );
  }

  const inviteUrl = `thalia://invite/${invitation.token}`;

  return Response.json(
    {
      token: invitation.token,
      inviteUrl,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expires_at,
    },
    { headers: corsHeaders },
  );
});
