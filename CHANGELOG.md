# Changelog

## 87-recordatorio-segun-estado-de-la-cita

- El recordatorio de una cita **ya confirmada** sale sin la frase del enlace. Antes lo incluía siempre, y pedirle confirmar algo que ya confirmó no tiene sentido
- El botón «Enviar ahora» del detalle de la cita desaparece en los estados que no admiten recordatorio: completada, cancelada, en sala y no asistió. El servidor ya los rechazaba, así que el botón prometía algo que no iba a pasar
- En esos estados la fila dice «Esta cita ya no recibe recordatorios» en lugar de «Pendiente de envío automático», que era falso


## 87-recordatorio-sin-enlace-colgando

- El recordatorio salía con «Confirma la cita pinchando en este enlace:» y nada detrás cuando no se podía generar el enlace. Parecía un mensaje cortado, que es peor que no mencionarlo: ahora se retira la frase entera
- La causa principal era que el enlace solo se generaba para citas en estado `scheduled`. Una cita ya confirmada seguía recibiendo recordatorio —y debe seguir recibiéndolo— pero se quedaba sin enlace. Ahora también lo lleva: la página responde «Tu cita ya está confirmada», que es información útil
- Solo se omite el enlace en las citas canceladas


## 83-splash-de-ios

- La PWA en iPhone arrancaba con la pantalla en blanco. No había ninguna etiqueta `apple-touch-startup-image`, e iOS no sabe generar el splash a partir del manifest como sí hace Android: exige una imagen por resolución
- Se añaden nueve pantallas de arranque cubriendo los iPhone en uso, del SE al 15 Pro Max, con el logo centrado sobre el crema de marca
- La media query debe encajar exactamente con el dispositivo: una talla que falte no degrada a otra parecida, deja la pantalla en blanco


## 87-vista-previa-del-enlace-de-confirmacion

- El enlace de confirmación que viaja en el recordatorio ya genera tarjeta de vista previa en WhatsApp, con el logo, «Confirmación de cita» y el dominio. Antes no había ninguna etiqueta Open Graph en la aplicación, así que el cliente rastreaba la página y se quedaba con el favicon escalado
- No es solo estético: el paciente recibe un enlace no solicitado con un identificador largo, y la tarjeta es lo que lo distingue de algo sospechoso
- `metadataBase` en el layout raíz. WhatsApp necesita una URL absoluta; con una relativa no descarga la imagen y la tarjeta sale sin ella. Sale de `NEXT_PUBLIC_SITE_URL` o, si no está, de la variable que Vercel inyecta en producción


## 83-logo-de-la-app-en-movil

- El icono instalado en el móvil deja de salir con el borde y las esquinas negras. Eran PNG con transparencia, y iOS no la admite en el `apple-touch-icon`: la compone sobre negro. Ahora son opacos sobre su propio crema, y el redondeo lo pone el sistema
- El manifest declaraba el mismo fichero como `any` y como `maskable`, pero el logo ocupaba el 83 % del ancho cuando la zona segura de Android es el 80 % del diámetro: en los lanzadores con máscara se recortaba. Se añaden `icon-maskable-192x192.png` y `icon-maskable-512x512.png` con la marca reducida y centrada
- Al reducir el logo asomaba un contorno cuadrado que resultó ser un trazo de 1 px del arte original, imperceptible a tamaño completo. Se recorta antes de escalar
- `icon.png` se deja con transparencia: es el favicon del navegador, donde sí es correcta

Para verlo hay que **desinstalar y reinstalar la PWA**: el sistema cachea el icono al instalar y no lo actualiza solo.


## 99-autonomo-solo-ve-sus-citas

- El profesional autónomo (`external`) solo ve las citas en las que es el profesional asignado, tanto en el listado como en la agenda. Antes veía la agenda entera de la clínica: con quién trabaja el resto del equipo, a qué hora y con qué paciente
- Tampoco puede modificar una cita ajena conociendo su identificador. Sí puede editar las suyas
- Desaparece el selector de profesional en la barra de filtros, en la hoja de filtros móvil y en la agenda: solo podría servirle para vaciar la lista
- Sin cambios para `owner`, `admin` ni `employee`

### Notas de implementación

- El filtro va en RLS y no en los hooks, igual que #102. Cubre a la vez listado, recuento, agenda, detalle y la vista `appointments_search`, que es `security_invoker`
- Aquí no hizo falta la corrección que sí necesitó `patients`: las políticas de citas ya estaban separadas por comando y ninguna era `FOR ALL`
- Resuelve de paso el efecto visible de #102: las citas ajenas salían con el nombre del paciente en blanco, porque el paciente ya estaba oculto pero la cita no


## 102-autonomo-solo-ve-sus-pacientes

- El profesional autónomo (`external`) solo ve en Pacientes los vinculados a citas donde él es el profesional asignado. Antes veía el censo completo de la clínica: nombres, teléfonos y fechas de nacimiento de gente que no ha tratado nunca
- Entrar por URL directa al detalle de un paciente ajeno devuelve «no encontrado», sin revelar si ese paciente existe
- Para el autónomo los pacientes pasan a ser de solo lectura, en la línea de #101
- Sin cambios para `owner`, `admin` ni `employee`: siguen viendo todos los pacientes de su clínica

### Notas de implementación

- El filtro va en RLS y no en el DAL. Ningún DAL de pacientes usa service role, así que la política corrige a la vez listado, recuento, búsqueda, detalle y llamadas directas a la API; filtrarlo en el DAL sería cosmético, bastaría con consultar PostgREST por fuera de la aplicación
- Nueva función `current_membership_role()`. La que ya existía, `current_employee_role()`, devuelve la profesión (doctor, reception…), no la relación con la clínica: un autónomo es `external` y `doctor` a la vez
- `patients_write_allowed_roles` era `FOR ALL` y permissive, y en PostgreSQL eso concede también `SELECT`. Como las políticas permisivas se combinan con OR, acotar solo la de lectura no habría servido de nada


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
