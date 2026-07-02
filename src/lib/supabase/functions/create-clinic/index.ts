import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const employeeRoles = new Set(["admin", "reception", "doctor", "auxiliary"]);

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

  const {
    name,
    address,
    phone,
    specialty,
    logoUrl,
    fullName,
    operationalRole,
    color,
    personalPhone,
  } = await req.json();

  if (!name || typeof name !== "string" || !name.trim()) {
    return Response.json(
      { error: "Clinic name is required" },
      { status: 400, headers: corsHeaders },
    );
  }

  const resolvedFullName =
    (typeof fullName === "string" && fullName.trim()) ||
    (authData.user.user_metadata?.full_name as string | undefined) ||
    authData.user.email?.split("@")[0] ||
    "Administrador";

  const resolvedRole =
    typeof operationalRole === "string" && employeeRoles.has(operationalRole)
      ? operationalRole
      : "admin";

  const { data: existingMemberships, error: membershipsError } =
    await adminClient
      .from("clinic_memberships")
      .select("id, role")
      .eq("user_id", authData.user.id)
      .eq("status", "active");

  if (membershipsError) {
    return Response.json(
      { error: membershipsError.message },
      { status: 400, headers: corsHeaders },
    );
  }

  if ((existingMemberships ?? []).length > 0) {
    return Response.json(
      { error: "User already belongs to a clinic" },
      { status: 400, headers: corsHeaders },
    );
  }

  const { data: clinic, error: clinicError } = await adminClient
    .from("clinics")
    .insert({
      name: name.trim(),
      address:
        typeof address === "string" && address.trim() ? address.trim() : null,
      phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
      specialty:
        typeof specialty === "string" && specialty.trim()
          ? specialty.trim()
          : null,
      logo_url: logoUrl ?? null,
      owner_id: authData.user.id,
    })
    .select("id")
    .single();

  if (clinicError || !clinic) {
    return Response.json(
      { error: clinicError?.message ?? "Failed to create clinic" },
      { status: 400, headers: corsHeaders },
    );
  }

  const { error: membershipError } = await adminClient
    .from("clinic_memberships")
    .insert({
      user_id: authData.user.id,
      clinic_id: clinic.id,
      role: "owner",
      status: "active",
      joined_at: new Date().toISOString(),
    });

  if (membershipError) {
    return Response.json(
      { error: membershipError.message },
      { status: 400, headers: corsHeaders },
    );
  }

  const { error: employeeError } = await adminClient.from("employees").upsert(
    {
      id: authData.user.id,
      clinic_id: clinic.id,
      full_name: resolvedFullName,
      role: resolvedRole,
      specialty:
        typeof specialty === "string" && specialty.trim()
          ? specialty.trim()
          : null,
      phone:
        typeof personalPhone === "string" && personalPhone.trim()
          ? personalPhone.trim()
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

  return Response.json({ clinicId: clinic.id }, { headers: corsHeaders });
});
