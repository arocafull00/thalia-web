import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function response(body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return response({ error: "Supabase is not configured" }, 500);
  }

  const body = await req.json().catch(() => null);
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  if (typeof body?.token === "string" && body.token.trim()) {
    const { data, error } = await adminClient
      .from("invitation_tokens")
      .select("email, role, expires_at, used_at, clinics(name)")
      .eq("token", body.token.trim())
      .maybeSingle();

    if (error) {
      return response({ error: "Invitation lookup failed" }, 500);
    }

    return response({ invitation: data ?? null });
  }

  if (typeof body?.email === "string") {
    const email = body.email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      return response({ error: "Invalid email" }, 400);
    }

    const { data, error } = await adminClient
      .from("invitation_tokens")
      .select("token, email, role, expires_at, clinics(name)")
      .ilike("email", email)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      return response({ error: "Invitation lookup failed" }, 500);
    }

    return response({ invitations: data ?? [] });
  }

  return response({ error: "Email or token is required" }, 400);
});
