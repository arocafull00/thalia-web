import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const QUIET_HOURS_START = 22;
const QUIET_HOURS_END = 9;

function isQuietHour(): boolean {
  const hour = new Date().getHours();
  return hour >= QUIET_HOURS_START || hour < QUIET_HOURS_END;
}

function buildMessage(
  template: string,
  vars: {
    paciente: string;
    clinica: string;
    fecha: string;
    hora: string;
    profesional: string;
  },
): string {
  return template
    .replace("{paciente}", vars.paciente)
    .replace("{clinica}", vars.clinica)
    .replace("{fecha}", vars.fecha)
    .replace("{hora}", vars.hora)
    .replace("{profesional}", vars.profesional);
}

async function sendWhatsAppMessage(
  fromNumber: string,
  token: string,
  to: string,
  message: string,
): Promise<boolean> {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");

  if (!accountSid) {
    return false;
  }

  const toFormatted = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const fromFormatted = fromNumber.startsWith("whatsapp:")
    ? fromNumber
    : `whatsapp:${fromNumber}`;

  const body = new URLSearchParams({
    From: fromFormatted,
    To: toFormatted,
    Body: message,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${accountSid}:${token}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    },
  );

  return response.ok;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");

  if (!supabaseUrl || !serviceRoleKey || !twilioAuthToken) {
    return new Response("Missing configuration", {
      status: 500,
      headers: corsHeaders,
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let manualAppointmentId: string | null = null;
  let manualClinicId: string | null = null;

  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (body.manual && body.appointmentId) {
        manualAppointmentId = body.appointmentId;
        manualClinicId = body.clinicId ?? null;
      }
    } catch {}
  }

  const { data: clinics, error: clinicsError } = await supabase
    .from("clinics")
    .select(
      "id, name, address, whatsapp_reminder_enabled, whatsapp_reminder_hours, whatsapp_phone_number_id, whatsapp_message_template",
    )
    .eq("whatsapp_reminder_enabled", true)
    .not("whatsapp_phone_number_id", "is", null);

  if (clinicsError) {
    return new Response(clinicsError.message, { status: 500 });
  }

  const targetClinics = manualClinicId
    ? (clinics ?? []).filter((c) => c.id === manualClinicId)
    : (clinics ?? []);

  let totalSent = 0;
  let totalFailed = 0;

  for (const clinic of targetClinics) {
    if (!clinic.whatsapp_phone_number_id) continue;

    const hoursWindows: number[] = manualAppointmentId
      ? [0]
      : (clinic.whatsapp_reminder_hours as number[]);

    for (const hoursBeforeTarget of hoursWindows) {
      if (!manualAppointmentId && isQuietHour()) continue;

      const windowStart = new Date(
        Date.now() + hoursBeforeTarget * 60 * 60 * 1000,
      );
      const windowEnd = new Date(windowStart.getTime() + 30 * 60 * 1000);

      let appointmentsQuery = supabase
        .from("appointments")
        .select(
          "id, starts_at, patients(full_name, phone), employees(full_name)",
        )
        .eq("clinic_id", clinic.id)
        .in("status", ["scheduled", "confirmed"]);

      if (manualAppointmentId) {
        appointmentsQuery = appointmentsQuery.eq("id", manualAppointmentId);
      } else {
        appointmentsQuery = appointmentsQuery
          .gte("starts_at", windowStart.toISOString())
          .lt("starts_at", windowEnd.toISOString());
      }

      const { data: appointments, error: apptError } = await appointmentsQuery;

      if (apptError || !appointments) continue;

      for (const appointment of appointments) {
        const patient = appointment.patients as {
          full_name: string;
          phone: string | null;
        } | null;
        const employee = appointment.employees as { full_name: string } | null;

        if (!patient?.phone) continue;

        const { data: existing } = await supabase
          .from("appointment_reminders")
          .select("id")
          .eq("appointment_id", appointment.id)
          .eq("hours_before", hoursBeforeTarget)
          .eq("reminder_type", "whatsapp")
          .eq("status", "sent")
          .maybeSingle();

        if (existing && !manualAppointmentId) continue;

        const appointmentDate = new Date(appointment.starts_at);
        const fecha = appointmentDate.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });
        const hora = appointmentDate.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const message = buildMessage(clinic.whatsapp_message_template, {
          paciente: patient.full_name,
          clinica: clinic.name,
          fecha,
          hora,
          profesional: employee?.full_name ?? "tu profesional",
        });

        const ok = await sendWhatsAppMessage(
          clinic.whatsapp_phone_number_id,
          twilioAuthToken,
          patient.phone,
          message,
        );

        await supabase.from("appointment_reminders").insert({
          appointment_id: appointment.id,
          clinic_id: clinic.id,
          patient_phone: patient.phone,
          hours_before: hoursBeforeTarget,
          status: ok ? "sent" : "failed",
          error_message: ok ? null : "WhatsApp API request failed",
          reminder_type: "whatsapp",
        });

        if (ok) {
          totalSent++;
        } else {
          totalFailed++;
        }
      }
    }
  }

  return new Response(
    JSON.stringify({ sent: totalSent, failed: totalFailed }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
