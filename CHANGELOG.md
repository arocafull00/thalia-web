# Changelog

## 85-87-confirmación-de-cita-y-recordatorios

### Confirmación de cita por el paciente (#87)

- El paciente confirma su cita desde un enlace que llega **dentro del propio recordatorio** de WhatsApp, sin llamadas ni mensajes de por medio. Un solo mensaje por cita: se descartó enviarlo aparte porque duplicaba el coste de mensajería y confirmar la víspera es más útil que hacerlo justo después de reservar
- Nueva vista pública `/cita/[token]`, fuera del shell de la aplicación, pensada para el navegador embebido de WhatsApp
- La página resuelve todos los estados: confirmable, ya confirmada, cancelada, pasada, enlace caducado, cita cerrada y token inválido. Confirmar es idempotente
- No muestra ningún dato del paciente: sólo clínica, fecha, hora y profesional. El enlace viaja por WhatsApp y se reenvía
- Interruptor en Ajustes, colgando del de recordatorios. Al guardar se valida que la plantilla contenga `{enlace}`: sin él el servicio quedaría encendido y mudo

### Recordatorios de WhatsApp (#85)

- **Las citas reservadas con menos de 24 h de antelación ya reciben recordatorio.** El barrido miraba una rodaja de 30 minutos que sólo avanzaba, así que esas citas no entraban en ninguna ejecución y se quedaban sin aviso para siempre
- **Las horas de silencio aplazan en vez de descartar.** Antes, una cita cuya ventana caía de madrugada perdía el recordatorio de forma permanente
- La programación del cron pasa a vivir en una migración. Antes existía sólo en el panel y un `db reset` o recrear el proyecto se la llevaba sin dejar rastro
- La clave del cron se lee de Vault en cada ejecución en lugar de ir incrustada en `cron.job.command`
- Trazas en las siete salidas que antes eran silenciosas, más un resumen por ejecución. El cron dispara con `net.http_post`, que es fire-and-forget: da por bueno el envío aunque no salga ningún mensaje
- El botón «Enviar ahora» deja de decir «enviado» cuando no se envió nada, y explica el motivo
- La deduplicación pasa a una sola consulta por clínica en lugar de una por cita

### Correcciones

- `/cita/[token]` añadida a las rutas públicas de `proxy.ts`. Sin eso el enlace del mensaje redirigía a `/login`
- La función de estado de la confirmación era `IMMUTABLE` llamando a `now()`: el planificador podía plegarla a constante y dejar una cita marcada como futura para siempre
- El profesional aparece con nombre y apellidos

## 2-fix-redirección-post-auth

- Usuario autenticado sin clínica redirige a `/create-clinic` en lugar de quedarse en `/login`
- Botón "Salir" añadido en la página de creación de clínica
- Navegaciones en `CreateClinicPageClient` movidas a `useEffect` para evitar updates durante el render. Error javascript que sale en el navegador:
  Cannot update a component (`Router`) while rendering a different component (`CreateClinicPageClient`). To locate the bad setState() call inside `CreateClinicPageClient`, follow the stack trace as described in https://react.dev/link/setstate-in-render
- Botón "Salir" añadido en la página de registro de empleado: cierra sesión si hay sesión activa, redirige a `/login` si no la hay
