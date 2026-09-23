# Bases legales de mensajes WhatsApp

Thalia envía dos tipos de mensajes por WhatsApp con finalidades distintas.

## Recordatorio de cita (asistencial)

- **Finalidad:** recordar una cita ya concertada entre la clínica y el paciente.
- **Base jurídica (RGPD):** art. 6.1.b — ejecución de medidas precontractuales o del contrato (la relación asistencial y la cita acordada).
- **LSSI:** no es comunicación comercial; no aplica el art. 21 LSSI-CE (oposición al marketing).
- **Minimización (art. 5.1.c):** el texto fijo incluye cuándo, la hora y el nombre de la clínica. No incluye nombre del paciente en el cuerpo del mensaje, profesional, tratamiento, dirección ni datos de categorías especiales (art. 9).
- **Consentimiento de marketing:** no se consulta `marketing_opt_in`; el recordatorio no depende del consentimiento promocional.
- **Implementación:** `supabase/functions/send-reminders/`, plantilla fija en `supabase/functions/_shared/care-reminder-message.ts`.

## Campaña promocional (marketing)

- **Finalidad:** promociones y avisos comerciales redactados por la clínica.
- **Base jurídica (RGPD):** art. 6.1.a — consentimiento del interesado.
- **LSSI:** art. 21 LSSI-CE — comunicaciones comerciales con consentimiento previo.
- **Consentimiento en producto:** `patients.marketing_opt_in`; el segmento (`campaign_segment_patients`, `campaign_patients_for_campaign`) excluye a quien no ha optado.
- **Contenido:** lo redacta la clínica; los filtros (p. ej. por tratamiento) eligen destinatarios pero no copian el historial clínico al mensaje.
- **Implementación:** `supabase/functions/send-campaign/`.

## Responsabilidad

La clínica es responsable del tratamiento frente al paciente. Thalia actúa como encargado del tratamiento según el contrato y la política de privacidad aplicables.
