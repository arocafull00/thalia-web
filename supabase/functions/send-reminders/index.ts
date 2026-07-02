import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const whatsappPhoneId = Deno.env.get("WHATSAPP_PHONE_ID");
  const whatsappToken = Deno.env.get("WHATSAPP_TOKEN");

  if (!supabaseUrl || !serviceRoleKey || !whatsappPhoneId || !whatsappToken) {
    return new Response("Missing configuration", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(
      "*, patients(full_name, phone), employees(full_name), appointment_treatments(treatment_types(name))",
    )
    .eq("reminder_sent", false)
    .eq("status", "scheduled")
    .gte("starts_at", `${dateStr}T00:00:00`)
    .lt("starts_at", `${dateStr}T23:59:59`);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  for (const appointment of appointments ?? []) {
    if (!appointment.patients?.phone) {
      continue;
    }

    const treatments =
      appointment.appointment_treatments
        ?.map(
          (item: { treatment_types: { name: string } | null }) =>
            item.treatment_types?.name,
        )
        .filter(Boolean)
        .join(", ") ?? "";

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: appointment.patients.phone,
          type: "template",
          template: {
            name: "appointment_reminder",
            language: { code: "es" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: appointment.patients.full_name },
                  {
                    type: "text",
                    text: new Date(appointment.starts_at).toLocaleTimeString(
                      "es-ES",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    ),
                  },
                  { type: "text", text: treatments },
                ],
              },
            ],
          },
        }),
      },
    );

    if (!response.ok) {
      continue;
    }

    await supabase
      .from("appointments")
      .update({ reminder_sent: true })
      .eq("id", appointment.id);
  }

  return new Response("OK");
});
