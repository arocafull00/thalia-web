import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { buildMessage, dropSentenceWith } from "../_shared/message-template.ts";
import { sendWhatsApp } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const QUIET_HOURS_START = 22;
const QUIET_HOURS_END = 9;

function isQuietHour(timezone: string): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: timezone,
    }).format(new Date()),
  );
  return hour >= QUIET_HOURS_START || hour < QUIET_HOURS_END;
}

// El token deja de valer una semana después de la cita. Para entonces la cita ya
// está en el pasado y la página lo dice; la caducidad es sólo el límite duro
// para que un enlace no viva indefinidamente.
const TOKEN_TTL_DAYS = 7;

/**
 * Enlace con el que el paciente confirma su cita, incrustado en el propio
 * recordatorio (#87). Va en el mismo mensaje y no en uno aparte: confirmar la
 * víspera es cuando le sirve a la clínica, y así no se duplica el coste.
 *
 * Devuelve null cuando no procede. Un fallo aquí nunca impide el recordatorio:
 * quedarse sin aviso es peor que quedarse sin botón, porque el paciente falta a
 * la cita.
 */
async function buildConfirmationLink(
  supabase: ReturnType<typeof createClient>,
  appointment: { id: string; status: string; starts_at: string },
  clinicId: string,
  appUrl: string | undefined,
): Promise<string | null> {
  /*
   * Una cita ya confirmada no necesita enlace: el recordatorio sale sin la
   * frase que lo menciona, no cojo. Eso lo resuelve `dropSentenceWith` en quien
   * llama, que es lo que faltaba cuando esto devolvía null y el hueco se
   * rellenaba con cadena vacía.
   */
  if (appointment.status !== "scheduled") return null;

  if (!appUrl) {
    console.error("[reminders] falta PUBLIC_APP_URL: se envía sin enlace");
    return null;
  }

  const expiresAt = new Date(
    new Date(appointment.starts_at).getTime() +
      TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Un único token por cita, garantizado por el índice único sobre
  // appointment_id: reenviar el recordatorio reutiliza el mismo enlace.
  const { data, error } = await supabase
    .from("appointment_confirmation_tokens")
    .upsert(
      {
        appointment_id: appointment.id,
        clinic_id: clinicId,
        expires_at: expiresAt,
      },
      { onConflict: "appointment_id" },
    )
    .select("token")
    .single();

  if (error || !data) {
    console.error("[reminders] no se pudo crear el token", error);
    return null;
  }

  return `${appUrl.replace(/\/+$/, "")}/cita/${data.token}`;
}

/**
 * Identificador del token dentro del enlace.
 *
 * En una plantilla aprobada por Meta con botón de URL sólo el sufijo puede ser
 * variable, así que la plantilla es del tipo `https://…/cita/{{6}}` y lo que
 * viaja es el token, no la URL entera. En modo mock y sandbox el enlace va
 * completo dentro del texto y esto no se usa.
 */
function tokenFromLink(link: string | null): string {
  return link ? (link.split("/").pop() ?? "") : "";
}

/*
 * Traza de la ejecución (#85).
 *
 * Esta función se dispara desde un cron con `net.http_post`, que es
 * fire-and-forget: el cron da por bueno el envío tanto si salieron cien
 * mensajes como si no salió ninguno. Estos logs son el ÚNICO sitio donde se ve
 * qué pasó de verdad.
 *
 * Nunca se registra el teléfono del paciente: los logs los conserva Supabase y
 * un número de móvil es dato personal. Se identifica por id de cita, que sirve
 * igual para depurar y no expone a nadie.
 */
type RunSummary = {
  trigger: "manual" | "cron";
  clinicsMatched: number;
  appointmentsScanned: number;
  sent: number;
  failed: number;
  skipped: Record<string, number>;
};

function skip(summary: RunSummary, reason: string, detail?: unknown): void {
  summary.skipped[reason] = (summary.skipped[reason] ?? 0) + 1;

  if (detail !== undefined) {
    console.log(`[reminders] omitido: ${reason}`, detail);
  }
}

// El envío vive en ../_shared/whatsapp.ts para que recordatorios y campañas
// compartan la misma integración con Twilio y los mismos modos de operación.

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  // Las credenciales de Twilio ya no se comprueban aquí: en modo mock no hacen
  // falta, y en los demás el adapter devuelve el motivo exacto si faltan.
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[reminders] faltan credenciales de Supabase", {
      tieneUrl: Boolean(supabaseUrl),
      tieneServiceRole: Boolean(serviceRoleKey),
    });
    return new Response("Missing configuration", {
      status: 500,
      headers: corsHeaders,
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const appUrl = Deno.env.get("PUBLIC_APP_URL");

  let manualAppointmentId: string | null = null;
  let manualClinicId: string | null = null;

  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (body.manual && body.appointmentId) {
        manualAppointmentId = body.appointmentId;
        manualClinicId = body.clinicId ?? null;
      }
    } catch (cause) {
      console.error("[reminders] cuerpo de la petición ilegible", {
        message: cause instanceof Error ? cause.message : String(cause),
      });
    }
  }

  const summary: RunSummary = {
    trigger: manualAppointmentId ? "manual" : "cron",
    clinicsMatched: 0,
    appointmentsScanned: 0,
    sent: 0,
    failed: 0,
    skipped: {},
  };

  console.log("[reminders] inicio", {
    trigger: summary.trigger,
    modo: Deno.env.get("WHATSAPP_MODE") ?? "mock",
    tienePublicAppUrl: Boolean(appUrl),
    appointmentId: manualAppointmentId,
  });

  const { data: clinics, error: clinicsError } = await supabase
    .from("clinics")
    .select(
      "id, name, address, timezone, whatsapp_reminder_enabled, whatsapp_reminder_hours, whatsapp_phone_number_id, whatsapp_message_template, whatsapp_confirmation_enabled",
    )
    .eq("whatsapp_reminder_enabled", true)
    .not("whatsapp_phone_number_id", "is", null);

  if (clinicsError) {
    console.error("[reminders] no se pudieron leer las clínicas", clinicsError);
    return new Response(clinicsError.message, { status: 500 });
  }

  const targetClinics = manualClinicId
    ? (clinics ?? []).filter((c) => c.id === manualClinicId)
    : (clinics ?? []);

  summary.clinicsMatched = targetClinics.length;

  if (targetClinics.length === 0) {
    // El filtro exige whatsapp_reminder_enabled y un número de envío. Decirlo
    // explícitamente ahorra buscar el fallo en el sitio equivocado.
    console.warn("[reminders] ninguna clínica elegible", {
      clinicasConRecordatoriosActivos: clinics?.length ?? 0,
      filtradaPor: manualClinicId ?? null,
    });
  }

  for (const clinic of targetClinics) {
    if (!clinic.whatsapp_phone_number_id) {
      skip(summary, "clinica_sin_numero", { clinicId: clinic.id });
      continue;
    }

    const hoursWindows: number[] = manualAppointmentId
      ? [0]
      : (clinic.whatsapp_reminder_hours as number[]);

    for (const hoursBeforeTarget of hoursWindows) {
      if (!manualAppointmentId && isQuietHour(clinic.timezone)) {
        skip(summary, "hora_de_silencio", {
          clinicId: clinic.id,
          timezone: clinic.timezone,
          ventana: hoursBeforeTarget,
          // Ya no se pierde: la cita sigue pendiente y sale en la primera
          // pasada fuera del horario de silencio.
          nota: "se aplaza a la siguiente ejecución",
        });
        continue;
      }

      /*
       * Todas las citas que empiezan de aquí a N horas y aún no tienen aviso,
       * en lugar de una rodaja de 30 minutos exactamente a N horas vista.
       *
       * La rodaja sólo miraba hacia delante, así que una cita reservada con
       * menos de N horas de antelación no entraba en ninguna ejecución, ni en
       * esa ni en las siguientes: se quedaba sin recordatorio para siempre. Con
       * el rango, la cita sigue pendiente hasta que se envía (#85).
       *
       * Lo que evita el duplicado es la deduplicación, no el estrechor de la
       * ventana: sin ella, este rango reenviaría el mismo aviso cada media hora.
       */
      const dueFrom = new Date();
      const dueUntil = new Date(
        Date.now() + hoursBeforeTarget * 60 * 60 * 1000,
      );

      let appointmentsQuery = supabase
        .from("appointments")
        .select(
          "id, starts_at, status, patients(full_name, phone), employees(full_name)",
        )
        .eq("clinic_id", clinic.id)
        .in("status", ["scheduled", "confirmed"]);

      if (manualAppointmentId) {
        appointmentsQuery = appointmentsQuery.eq("id", manualAppointmentId);
      } else {
        appointmentsQuery = appointmentsQuery
          .gte("starts_at", dueFrom.toISOString())
          .lte("starts_at", dueUntil.toISOString());
      }

      const { data: appointments, error: apptError } = await appointmentsQuery;

      if (apptError) {
        console.error("[reminders] fallo al leer las citas", {
          clinicId: clinic.id,
          ventana: hoursBeforeTarget,
          message: apptError.message,
        });
        skip(summary, "error_consulta_citas");
        continue;
      }

      if (!appointments) {
        skip(summary, "sin_citas_en_ventana");
        continue;
      }

      summary.appointmentsScanned += appointments.length;

      /*
       * Qué citas ya tienen aviso, en una sola consulta.
       *
       * Antes se preguntaba una vez por cita, y con la rodaja de 30 minutos eso
       * era casi siempre una consulta. Con el rango de N horas serían decenas
       * por clínica y pasada, cada media hora: preguntarlo en bloque mantiene
       * el coste en una consulta pase lo que pase.
       */
      const alreadySent = new Set<string>();

      if (appointments.length > 0) {
        const { data: sentRows, error: sentError } = await supabase
          .from("appointment_reminders")
          .select("appointment_id")
          .in(
            "appointment_id",
            appointments.map((appointment) => appointment.id),
          )
          .eq("hours_before", hoursBeforeTarget)
          .eq("reminder_type", "whatsapp")
          .eq("status", "sent");

        if (sentError) {
          // Sin saber qué se envió ya, seguir enviaría duplicados a pacientes
          // reales. Mejor no mandar nada en esta pasada y que salga en la
          // siguiente: la cita sigue pendiente.
          console.error("[reminders] no se pudo leer lo ya enviado", {
            clinicId: clinic.id,
            message: sentError.message,
          });
          skip(summary, "error_consulta_enviados");
          continue;
        }

        for (const row of sentRows ?? []) {
          alreadySent.add(row.appointment_id as string);
        }
      }

      // Deja por escrito el rango exacto que se miró. Es lo primero que hace
      // falta para responder a "¿por qué no se envió el aviso de esta cita?".
      console.log("[reminders] ventana", {
        clinicId: clinic.id,
        horasAntes: hoursBeforeTarget,
        desde: dueFrom.toISOString(),
        hasta: dueUntil.toISOString(),
        citasEnRango: appointments.length,
        yaAvisadas: alreadySent.size,
      });

      for (const appointment of appointments) {
        const patient = appointment.patients as {
          full_name: string;
          phone: string | null;
        } | null;
        const employee = appointment.employees as { full_name: string } | null;

        if (!patient?.phone) {
          skip(summary, "paciente_sin_telefono", {
            appointmentId: appointment.id,
          });
          continue;
        }

        if (alreadySent.has(appointment.id) && !manualAppointmentId) {
          skip(summary, "ya_enviado");
          continue;
        }

        const appointmentDate = new Date(appointment.starts_at);
        const fecha = appointmentDate.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          timeZone: clinic.timezone,
        });
        const hora = appointmentDate.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: clinic.timezone,
        });

        const enlace = clinic.whatsapp_confirmation_enabled
          ? await buildConfirmationLink(
              supabase,
              appointment as { id: string; status: string; starts_at: string },
              clinic.id,
              appUrl,
            )
          : null;

        // Sin enlace se retira la frase que lo menciona. Dejarla apuntando a
        // la nada es lo que hace que el mensaje parezca cortado.
        const plantilla = enlace
          ? clinic.whatsapp_message_template
          : dropSentenceWith(clinic.whatsapp_message_template, "{enlace}");

        const message = buildMessage(plantilla, {
          paciente: patient.full_name,
          clinica: clinic.name,
          fecha,
          hora,
          profesional: employee?.full_name ?? "tu profesional",
          enlace: enlace ?? "",
        });

        const result = await sendWhatsApp({
          from: clinic.whatsapp_phone_number_id,
          to: patient.phone,
          body: message,
          // WHATSAPP_MODE=production no admite texto libre: sin plantilla el
          // adaptador rechaza el envío y el recordatorio no sale. El texto de
          // arriba sigue siendo el que se manda en mock y sandbox.
          templateSid: Deno.env.get("WHATSAPP_REMINDER_TEMPLATE_SID") ?? null,
          templateVariables: {
            "1": patient.full_name,
            "2": clinic.name,
            "3": fecha,
            "4": hora,
            "5": employee?.full_name ?? "tu profesional",
            "6": tokenFromLink(enlace),
          },
        });

        const ok = result.ok;

        if (!ok) {
          // El motivo real de Twilio. 63015/63016 suele ser sesión de sandbox
          // caducada; 63021, contenido no admitido por el canal.
          console.error("[reminders] Twilio rechazó el envío", {
            appointmentId: appointment.id,
            clinicId: clinic.id,
            error: result.error,
          });
        }

        const { error: logError } = await supabase
          .from("appointment_reminders")
          .insert({
            appointment_id: appointment.id,
            clinic_id: clinic.id,
            patient_phone: patient.phone,
            hours_before: hoursBeforeTarget,
            status: ok ? "sent" : "failed",
            // Guardar el motivo real de Twilio en lugar de un texto genérico.
            error_message: ok ? null : result.error,
            reminder_type: "whatsapp",
          });

        if (logError) {
          // El mensaje ya salió. Si el registro falla, la deduplicación deja de
          // protegerlo y el paciente puede recibirlo dos veces.
          console.error("[reminders] enviado pero no registrado", {
            appointmentId: appointment.id,
            message: logError.message,
          });
        }

        if (ok) {
          summary.sent++;
        } else {
          summary.failed++;
        }
      }
    }
  }

  // Una sola línea con el desenlace completo: es lo que se busca al abrir los
  // logs, y evita reconstruir la ejecución juntando líneas sueltas.
  const level = summary.failed > 0 ? console.error : console.log;
  level("[reminders] fin", summary);

  // El resumen viaja también en la respuesta para que el envío manual desde la
  // app pueda decir por qué no salió, en vez de un "hecho" que no es cierto.
  return new Response(JSON.stringify(summary), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
