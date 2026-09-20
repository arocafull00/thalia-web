# Changelog

## aurora-cristal-en-la-seccion-central

- La sección central de la app pasa a ser cristal sobre un fondo en degradado de `--primary` a `--secondary`. El sidebar y la navbar se quedan opacos y ganan un filete de 1,5px en primary: son el marco, y un marco translúcido compite con lo que enmarca
- El filete sale de `--border-frame`, un único token que comparten los dos. Estaban en dos reglas distintas y era cuestión de tiempo tocar una y olvidar la otra
- **La barra de filtros nunca llegaba a ser del mismo color que la lista.** Vivía dentro del contenedor que scrollea, así que tenía que ser `sticky` y pintar algo opaco para tapar las filas que le pasaban por debajo — y ese relleno se sumaba al de la tarjeta de cristal. La banda salía más pálida siempre, se le pusiera el valor que se le pusiera: dos capas contra una
- Se arregla sacándola del área de scroll, hermana del pie, que ya estaba resuelto así. Como no se solapa con nada, no necesita fondo y enseña la tarjeta tal cual. Ahora las dos zonas son la misma superficie **por construcción**, no por haber acertado un número: si mañana cambia la opacidad de la tarjeta, se mueven juntas. `.surface-glass-sticky` desaparece
- Tres intentos anteriores fallaron por cosas que conviene no repetir, y quedan escritas en `CLAUDE.md`: en `background` solo la última capa puede ser un color, y una capa intermedia de color invalida la declaración entera sin avisar; y un `backdrop-filter` dentro de otro solo muestrea hasta su ancestro, así que aplica el `saturate` dos veces y cambia el color en lugar de igualarlo
- `CLAUDE.md` y `DESIGN.md` decían «nada de glassmorphism ni `backdrop-filter`». La regla que las sustituye no es «ahora sí»: es **una sola** superficie con blur —la tarjeta de contenido—, porque es la única con fondo de verdad detrás. Sobre algo opaco el blur es coste de GPU sin efecto, y anidado rompe el color

## 158-restyling-de-finanzas

- **El porcentaje del desglose por categoría estaba mal.** El denominador era la suma de ingresos MÁS gastos, así que con 4.000 € ingresados —3.000 de «Tratamientos»— y 800 € de gastos, esa categoría salía al 63 % cuando es el 75 % de lo que entró. La barra de progreso pintaba esa cifra: el número no era raro, era falso
- Se arregla calculando el desglose **por tipo en origen**, no filtrando en pantalla: el resumen devuelve los dos y el selector cambia de uno a otro sin volver a consultar. Así el porcentaje es correcto por construcción y no depende de que alguien recuerde filtrar
- Selector de tipo de movimiento en el desglose, que es lo que pedía la issue y lo que hace que la cifra signifique algo
- Las barras del desglose toman el color del tipo: verde lo que entra, rojo lo que sale. Con un único color, dos desgloses de significado opuesto se leían idénticos y había que mirar el selector para saber cuál estabas viendo
- La fila de desgloses pasa a tres columnas iguales —semanal, por categoría y gastos sobre ingresos— en lugar de una rejilla asimétrica que dejaba un hueco en el centro
- Las tarjetas de Finanzas pasan a ser las mismas que las de Inventario: `rounded-card`, canto verde y superficie plana. Las métricas eran una rejilla con divisores, que leía como una tabla en vez de como cuatro cifras independientes
- El estado del selector vive en el hook y no en la URL: es una preferencia de lectura del momento, no algo que merezca compartirse por enlace como el mes o los filtros del listado


## 163-el-autonomo-no-escribe-sobre-las-citas

- **Un autónomo podía borrar la cita de otro profesional de su clínica.** `delete_appointment` es `SECURITY DEFINER` y comprobaba el rol, no el tipo de cuenta: un autónomo tiene `role = 'doctor'`, que es lo natural para un profesional sanitario, así que pasaba el filtro. Y como la función se salta la RLS, buscaba la cita por identificador sin mirar de quién era. Verificado, y cerrado
- Un profesional externo pasa a **no escribir nada** sobre las citas: ni crear, ni editar, ni cambiar el estado, ni borrar. Conserva ver las suyas y aceptar o rechazar las que le proponen
- Las cuatro políticas de escritura de `appointments` llevaban una rama `employee_id = auth.uid() AND is_external_member(...)`. Como se suman con `OR`, bastaba una para dejarle pasar. Sustituidas por una de alta y otra de modificación, ambas solo para personal interno
- De paso desaparece la duplicidad que señalaba la #163: `appointments_insert_active_clinic` englobaba a `appointments_insert_internal` y la segunda no añadía nada
- Editar no fallaba del todo, que era lo peor: la cita se guardaba, el borrado de los tratamientos viejos devolvía éxito sin borrar nada —RLS no le deja ver esas filas— y solo reventaba al insertar los nuevos. La cita quedaba con la duración recalculada de unos tratamientos que no eran los que tenía guardados
- Aceptar y rechazar siguen funcionando: van por `respond_external_appointment`, que es `SECURITY DEFINER` con sus propias comprobaciones. Verificado, no supuesto


## 163-mitigacion-crear-citas-como-externo

- Un profesional externo deja de ver el botón «Nueva cita» en Inicio, Citas y Agenda, en escritorio y en móvil. La base le permitía crear la cita pero no añadirle tratamientos, así que quedaba vacía y con un error que hablaba de una tabla que él no había tocado — y desde que existe la sincronización, además le aparecía en su Google Calendar
- Es una mitigación, no la decisión: queda por resolver en la #163 si un autónomo debe poder crear y completar sus propias citas


## respond-external-appointment-cast

- **Un profesional externo no podía aceptar ni rechazar ninguna cita.** `respond_external_appointment` asigna el estado con un `CASE` que devuelve texto, y la migración de enums nativos del 16 de septiembre convirtió la columna sin actualizar la función: `column "status" is of type public.appointment_status but expression is of type text`
- La cita se quedaba en `pending_external` para siempre, y de ahí cuelgan otras dos cosas: ni recordatorio al paciente ni evento en el calendario, porque los dos exigen que esté aceptada. Los dos flujos «funcionaban» negándose a actuar sobre citas que nunca podrían salir de ese estado
- El cuerpo de la función es el que había en producción; el único cambio es el cast


## 96-cimientos-de-google-calendar

- Las citas se sincronizan con Google Calendar. Cada profesional conecta su cuenta desde Ajustes y sus citas aparecen en un calendario «Thalia» propio, que Thalia crea y es lo único que puede tocar
- La conexión es **por profesional**, no por clínica. La cita lleva `employee_id` y quien quiere su agenda en el móvil es el profesional; una cuenta de clínica obligaría a decidir de quién es, y al marcharse esa persona la clínica perdería el calendario. Google empuja igual: el dueño de un calendario secundario es la cuenta que lo crea
- Permisos por columna: Ajustes ve con qué cuenta está conectado y cuándo sincronizó. El puntero al token y `last_error` no salen al navegador, y escribir en la conexión está denegado — conectar pasa por el servidor, porque si no se podría apuntar a otra cuenta
- Los cambios se capturan con un **trigger a una cola**, no desde el DAL. Hay escrituras sobre `appointments` que no pasan por la aplicación —la confirmación del paciente por WhatsApp y la aceptación del autónomo son UPDATE dentro de la base— y un enganche en el código las perdería. Además, si Google se cae, dar una cita tiene que seguir funcionando
- El borrado se captura **antes** y no después: `appointment_calendar_events` referencia la cita con `ON DELETE CASCADE`, así que para cuando corre un trigger `AFTER` ya no existe el `google_event_id` y el evento se quedaría colgado en el calendario para siempre
- Tabla puente en lugar de una columna `google_event_id` sobre `appointments`: al reasignar una cita hay que borrar el evento de un calendario y crearlo en otro, y una sola columna no puede decir en cuál vive cada uno
- El trigger solo encola si el profesional tiene conexión activa, así que hoy la cola se queda vacía y no añade peso a la base
- **Conectar y desconectar desde Ajustes → Usuario.** El refresh token se guarda cifrado en Vault y la conexión solo conserva un puntero; las tres funciones que lo tocan están cerradas a `service_role`, porque viven en `public` para que las alcance la API y sin eso cualquier usuario podría pedir el token de un compañero pasando su id
- El flujo se fuerza al host canónico antes de empezar. La URI de retorno que Google exige es fija, así que el callback aterriza en el dominio raíz sí o sí; si alguien arrancase desde `www`, la cookie del estado se quedaría allí y no volvería — la #161 otra vez
- Se piden también `openid email`, no sensibles como el de Calendar: sin ellos Google no dice con qué cuenta te has conectado y quien tenga dos no sabría cuál acaba de enlazar
- Desconectar revoca el permiso en Google además de borrar la copia local. Si solo borrásemos la nuestra, Thalia seguiría apareciendo indefinidamente entre las aplicaciones con acceso a esa cuenta. Y si Google no responde, la desconexión se completa igual
- El panel dice explícitamente qué no viaja: solo fecha y hora, ni paciente, ni tratamiento, ni notas
- `SettingsActionRow` deja de pintar la flecha cuando la fila no tiene destino ni acción. Una fila que parece un botón y no responde se lee como que la aplicación está rota
- Alias de `server-only` en la configuración de Vitest: el paquete lanza nada más importarse fuera de Next, así que hasta ahora ningún test podía tocar un módulo de `src/lib/server/` ni de Stripe
- **Las citas ya llegan a Google.** Un worker vacía la cola cada cinco minutos, pero el cron solo lo despierta si hay algo pendiente: con la base al límite de memoria, 288 llamadas diarias en vacío no se sostienen
- El evento se titula «Cita · <clínica>». El nombre de la clínica es suyo, no del paciente, y no dice nada de su salud, así que no cruza la regla; y es lo único que distingue las citas de un profesional que pasa consulta en varios sitios, porque todas caen en el mismo calendario
- **Solo llegan a Google las citas que el profesional ha tomado.** Lista blanca de estados, no lista negra: una cita que un autónomo todavía no ha aceptado —o que rechazó— no le ocupa hueco en su calendario, y un estado nuevo que nadie contemple no sale del sistema por omisión. Si una cita ya sincronizada pasa a uno de esos estados, su evento se retira
- **A Google viaja el cuándo, nunca el qué.** El evento lleva la franja horaria y un enlace de vuelta a Thalia; ni paciente, ni tratamiento, ni notas. El nombre de un paciente ahí revelaría que se trata en una clínica estética —dato de salud cedido a un tercero—, así que hay un test que recorre el evento entero y se rompe si alguien lo añade
- Una cita cancelada o con el paciente ausente retira su evento en lugar de actualizarlo: dejarlo llevaría al profesional a creer que sigue ocupado
- La cola se reclama con `FOR UPDATE SKIP LOCKED` y el reintento se programa **antes** de intentar nada, para que una fila que tumbe al worker no vuelva de inmediato a tumbarlo otra vez. La espera crece de 1 a 60 minutos
- `/api/google-calendar/sync` entra en las rutas públicas del proxy. La llama pg_cron sin sesión, y sin esto habría recibido un redirect a `/login` indefinidamente sin que saltara ninguna alarma. No queda abierta: exige un secreto compartido
- El error de Google conserva el código además de la descripción. Quedarse con la descripción dejaba «Bad Request» y perdía el `invalid_grant`, que es lo único que distingue un permiso revocado de un fallo pasajero: la conexión se habría reintentado para siempre en vez de pedir reconectar


## suite-e2e-y-politica-de-privacidad-publica

- **La política de privacidad era inaccesible para quien no ha iniciado sesión.** El pie del login enlaza a `/privacidad`, pero esa ruta no estaba entre las públicas del proxy, así que devolvía a `/login` — justo a las personas a las que va dirigida. Añadida, y con un test unitario que fija la lista entera: es la tercera vez que se olvida una ruta pública
- Cinco tests E2E llevaban rotos desde `14c721e` por cambios de interfaz sin cobertura actualizada. `DataTable` ganó `getRowHref`, que envuelve en enlace solo la celda principal: pinchar la fila dejó de abrir el diálogo de paciente y de navegar al detalle de campaña. Finanzas se partió en «Resumen» y «Movimientos», y el listado —con su buscador— ya no es lo primero que se ve. El detalle de paciente pasó de seis pestañas a dos, con el resto convertido en secciones fijas
- Los helpers pinchan el enlace **por nombre** y no con `.first()`: la fila lleva un segundo enlace, el de «Ver detalle», y apoyarse en el orden del DOM volvería a dejarlo frágil
- El test de envío de campañas tenía la misma interacción rota sin que se notase, porque se salta mientras el edge runtime está desactivado. Arreglado también, para que no explote el día que se active


## 161-login-con-google-en-thalia-app-es

- **La causa estaba en la configuración, no en el código**: la lista de Redirect URLs de Supabase no cubría el `redirect_to` porque este lleva query (`/callback?next=%2Fdashboard`) y una entrada literal no la empareja. Se resolvió con el comodín `https://www.thalia-app.es/**`
- Cuando Supabase descarta el `redirect_to` no da error: cae al Site URL con el código pegado. La raíz redirigía a `/dashboard` sin mirarlo, así que nadie lo canjeaba y el usuario acababa en `/login` sin un solo error en toda la cascada. Ahora la raíz reenvía el código a `/callback` en vez de tragárselo
- Un intercambio fallido en `/callback` se reporta a Sentry con el host y el destino. Antes se descartaba el error, y como la ruta devuelve un redirect en vez de lanzar, tampoco lo veía la instrumentación automática: el fallo no dejaba rastro en ningún sitio


## 81-breadcrumb-en-una-linea

- En escritorio el rastro y el título de la página van en una sola línea —«Pacientes › Alejandro Blanco»— en lugar de apilados. La barra baja de 58 a 54 px
- En móvil se mantiene apilado, donde el ancho no da para los dos seguidos
- El corte está en `xl` (1280 px) y no en `lg`: a 1024 px el selector de clínica y los botones ya dejan al título sin sitio, y en una sola línea desaparecería del todo


## 107-cuenta-atras-al-reenviar-contrasena

- Tras pedir el correo de cambiar contraseña, el botón muestra una cuenta atrás de 60 s y se deshabilita. Antes se podía pulsar sin parar sin ver nada distinto, y el usuario acababa pensando que la pantalla estaba rota
- La espera se guarda por usuario y sobrevive a recargar la página. Con estado en memoria bastaba refrescar para ver el botón activo, pulsar, y que Supabase rechazase el envío igual
- No añade protección: el límite real lo aplica Supabase Auth en el servidor. Esto lo hace visible


## 125-bucket-de-avatares-privado

- **Las fotos de los pacientes dejan de ser públicas.** El bucket `avatars` tenía `public = true` y se servía con URL pública: cualquiera con el enlace veía la cara de un paciente sin autenticarse, y ninguna política intervenía porque en un bucket público el RLS no se aplica
- Ahora es privado y se sirve con URL firmada, como los otros tres buckets
- La regla de lectura del avatar de un paciente delega en `can_access_patient`, el mismo criterio que gobierna la tabla: un autónomo solo ve los de sus citas
- El avatar de un paciente solo lo puede cambiar quien puede editar pacientes, y el de un empleado solo él mismo
- Al reemplazar un avatar se invalida su URL en caché. Con `upsert`, sin eso la firma anterior seguiría sirviendo la foto vieja hasta 50 minutos


## 141-147-ajustes-de-interfaz

- Fuera el subtítulo y el placeholder del campo de número de envío en Ajustes. Explicaban el formato de Twilio con prefijo internacional, que no significa nada para quien usa la clínica (#141)
- El modal de instalación deja de mostrar «Instalar Thalia» dos veces: la cabecera del diálogo ya lo dice (#147). El panel de Ajustes sí lo conserva, porque su encabezado es «Aplicación» y sin el título no se sabría qué se instala


## 143-politicas-rls-de-una-sola-clinica

- Quien pertenece a **dos clínicas** vuelve a ver sus datos en ambas. Tras hacer globales a los empleados quedaron 18 políticas usando `current_employee_clinic_id()`, que devuelve solo la primera membresía activa: al cambiar de clínica, el selector pedía datos que RLS no permitía y la lista salía vacía, sin error. Afectaba a citas, campañas, transacciones, tratamientos de cita, materiales y ficheros de campaña
- **Cerrada una fuga de teléfonos de pacientes.** `campaigns` solo filtraba por clínica, sin mirar rol ni si el usuario era externo, y `campaign_recipients` cuelga de ella guardando teléfonos: un autónomo que solo podía ver 1 paciente obtenía los teléfonos de 5
- El marketing deja de ser visible para el autónomo, también a nivel de datos y no solo de navegación
- Seis de esas políticas eran `FOR ALL`, que en PostgreSQL concede también `SELECT`. Al pasar a `can_manage_clinic` —que empieza por `NOT is_external_user()`— esa vía queda cerrada
- Eliminada `current_membership_role()`: había dos mecanismos para saber quién es externo y ahora hay uno


## 86-alinear-el-texto-de-produccion

- `supabase db diff --linked` devolvía una pared de falsos positivos aunque la reconciliación anterior ya hubiese traído los cinco objetos que faltaban. El objetivo de la issue no eran esos objetos: era poder fiarse del diff
- Una docena de funciones difería **solo en los finales de línea**: ninguna migración del repo tiene CRLF, así que los `\r\n` estaban en producción, de haberse creado desde el editor SQL del panel
- Dos políticas usaban `auth.jwt()` en producción y `(SELECT auth.jwt())` en el repo — la optimización del asesor de Supabase, aplicada al fichero después de desplegarlo
- Se vuelven a emitir esas definiciones tomándolas literalmente de los ficheros donde ya estaban, para que producción guarde el mismo texto. Sin cambio de comportamiento


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
