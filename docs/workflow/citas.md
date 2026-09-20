# Flujo de una cita

Cómo funciona una cita en Thalia de principio a fin: quién dispara cada acción, qué ocurre dentro de Supabase y qué sale hacia servicios externos.

Refleja el estado del sistema, no el diseño ideal. Si algo aquí te sorprende, probablemente sea un fallo de la aplicación y no de este documento.

---

## Estados

| Estado | Qué significa |
|---|---|
| `pending_external` | La clínica se la ha propuesto a un autónomo y este aún no ha respondido |
| `rejected_external` | El autónomo la ha rechazado |
| `scheduled` | Programada y en firme |
| `confirmed` | El **paciente** la ha confirmado desde el enlace de WhatsApp |
| `in_progress` | En curso |
| `completed` | Realizada |
| `cancelled` | Anulada |
| `no_show` | El paciente no se presentó |

Solo `pending_external` y `rejected_external` existen para autónomos. Un empleado interno nunca pasa por ahí.

---

## El camino normal: profesional interno

```
  Recepción crea la cita
        │
        ▼
    scheduled ──────────────► [24 h antes] WhatsApp al paciente
        │                              │
        │                              ▼
        │                      el paciente pincha el enlace
        │                              │
        │                              ▼
        │                          confirmed
        │
        ▼
   in_progress ──► completed ──► descuenta inventario
```

Sin paso de aceptación: la cita nace `scheduled` y ya cuenta.

---

## El camino del autónomo

Un autónomo (`account_type = 'external'`) no recibe citas impuestas. Tiene que aceptarlas.

```
  Recepción se la propone
        │
        ▼
  pending_external ──► aviso en la campana del autónomo
        │
        ├── acepta  ──►  scheduled   ──► entra en el camino normal
        │
        └── rechaza ──►  rejected_external
```

**Si la clínica cambia la hora o el profesional de una cita ya aceptada, vuelve a `pending_external`** y hay que aceptarla otra vez. El compromiso era para una hora concreta.

El trigger contempla una excepción —si fuese el propio autónomo quien mueve su cita, se quedaría en `scheduled`— pero hoy no puede darse: un externo no modifica citas. Queda ahí por si algún día se le devuelve esa capacidad.

---

## Quién puede hacer qué

| Acción | Quién |
|---|---|
| Crear una cita | Personal interno (`admin`, `reception`, `doctor`) |
| Aceptar o rechazar | Solo el autónomo al que se le asigna |
| Cambiar hora o profesional | Personal interno |
| Confirmar | **El paciente**, desde el enlace de WhatsApp. Nadie más |
| Cancelar o borrar | Personal interno |

**Un profesional externo no escribe nada sobre las citas.** Ve las suyas y responde a las que le proponen; nada más. Si necesita mover o anular una ya aceptada, lo habla con la clínica y lo hace el personal interno.

Está cerrado en la base de datos, no solo en la interfaz: las políticas de alta y modificación exigen personal interno, y `delete_appointment` comprueba el tipo de cuenta además del rol. Esto último importa porque un autónomo tiene `role = 'doctor'` —lo natural para un sanitario— y esa función se salta la RLS: sin la comprobación podía borrar la cita de un compañero conociendo su identificador.

> Pendiente: un sistema para que el profesional **solicite** aplazar o anular una cita, en lugar de tener que llamar a la clínica.

---

## Lo que ocurre dentro de Supabase

Siete triggers sobre `appointments`, en este orden:

**Antes de escribir**

| Trigger | Qué hace |
|---|---|
| `appointments_external_state` | Fuerza `pending_external` si la cita es de un autónomo, y la devuelve a pendiente si le cambian la hora |
| `appointments_require_available_inventory` | Impide completar una cita si no hay material suficiente |
| `appointments_updated_at` | Sella `updated_at` |
| `appointments_enqueue_calendar_delete` | **Solo en borrados.** Encola la retirada del evento de Google *antes* de que el borrado en cascada se lleve por delante el identificador |

**Después de escribir**

| Trigger | Qué hace |
|---|---|
| `appointments_completed_deduct_inventory` | Al pasar a `completed`, descuenta el material |
| `appointments_external_notifications` | Crea el aviso para la campana del autónomo |
| `appointments_enqueue_calendar_sync` | Encola el cambio para Google, **solo si ese profesional tiene el calendario conectado** |

---

## Recordatorio por WhatsApp

**Lo dispara:** `pg_cron`, cada 30 minutos → función `send-reminders`.

**A quién:** al paciente, no al profesional.

**Qué citas entra a mirar:**

- Solo estados `scheduled` y `confirmed`. **Una cita sin aceptar por el autónomo nunca genera recordatorio**
- Las que empiezan entre ahora y las N horas configuradas por la clínica
- Que no tengan ya un aviso enviado

**Por qué el rango y no una rodaja exacta:** antes miraba solo las citas a exactamente 24 h vista. Una cita reservada con menos antelación no caía en ninguna pasada y se quedaba sin recordatorio para siempre. Lo que evita el duplicado es la deduplicación, no lo estrecho de la ventana.

**No envía** en horario de silencio; lo aplaza a la siguiente pasada.

**El mensaje** lleva un enlace de confirmación si la clínica lo tiene activado **y la cita todavía es `scheduled`**. A una ya confirmada no se le pide confirmarla otra vez, y la frase del enlace se retira entera del texto para que no quede colgando.

### Cuando el paciente confirma

Abre `/cita/<token>` —pública, sin sesión— y pulsa el botón:

```
confirm_appointment_by_token()
        │
        ├──► appointments.status = 'confirmed'
        └──► marca el token como usado
```

El enlace es de un solo uso.

---

## Sincronización con Google Calendar

**Quién la activa:** cada profesional, desde *Ajustes → Usuario*. Es suya, no de la clínica.

Al conectar, Thalia **crea un calendario nuevo** en su cuenta, «Thalia — <clínica>», y solo escribe ahí. Su agenda personal no se toca: el permiso que se pide (`calendar.app.created`) no da acceso a ningún otro calendario.

### El recorrido

```
  cambia una cita
        │
        ▼
  trigger ──► ¿tiene ese profesional el calendario conectado?
        │           │
        │           └── no ──► no se encola nada
        ▼
  cola en la base de datos
        │
        ▼
  pg_cron cada 5 min, solo si hay algo pendiente
        │
        ▼
  POST /api/google-calendar/sync
        │
        ▼
  calendario del profesional
```

Hasta cinco minutos de retardo. No es instantáneo y no pretende serlo.

### Qué citas llegan a Google

Solo `scheduled`, `confirmed`, `in_progress` y `completed`.

Quedan fuera, y cada una por su motivo:

| Estado | Por qué no |
|---|---|
| `pending_external` | Aún no la ha aceptado. Verla reservada le haría bloquear un hueco al que no se ha comprometido |
| `rejected_external` | La rechazó |
| `cancelled`, `no_show` | El hueco queda libre |

Es una **lista blanca**: un estado nuevo que nadie haya contemplado no sale del sistema por omisión. Si una cita ya sincronizada pasa a cualquiera de esos estados, **su evento se retira** del calendario en lugar de actualizarse.

### Qué ve Google, y qué no

> Viaja el **cuándo** y el **dónde**. Nunca el **quién** ni el **qué**.

| Sí | No |
|---|---|
| Fecha y hora | Nombre del paciente |
| Nombre de la clínica | Tratamiento |
| Enlace de vuelta a Thalia | Notas clínicas, teléfono, DNI |

El nombre de un paciente en un evento de Google revelaría que esa persona se trata en una clínica estética: dato de salud, categoría especial del RGPD, cedido a un tercero. El de la clínica es suyo y no dice nada de nadie.

Hay un test que recorre el evento entero y falla si aparece cualquier término clínico.

### Si el profesional revoca el permiso

Thalia lo detecta al siguiente intento, marca la conexión como caducada y deja de insistir. Ajustes pasa a pedirle que vuelva a conectar.

---

## Lo que no ocurre

- **Google no manda sobre Thalia.** Mover el evento en Google no mueve la cita. Cada evento lo avisa en su descripción.
- **Un profesional en varias clínicas tiene un solo calendario**, con las citas de todas. El nombre de la clínica en el título es lo que las distingue.
- **El recordatorio no se reenvía** si el paciente no contesta. Se envía una vez por cita y ventana.

---

## Servicios externos

| Servicio | Para qué | Quién lo dispara |
|---|---|---|
| **Twilio / WhatsApp** | Recordatorio al paciente | `pg_cron`, cada 30 min |
| **Google Calendar** | Agenda del profesional | `pg_cron`, cada 5 min, solo si hay trabajo |

Los dos van por cola o por barrido, nunca en la petición del usuario. **Si cualquiera de los dos se cae, dar una cita sigue funcionando.**
