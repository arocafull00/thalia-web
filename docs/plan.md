# Plan de migración `thalia` web -> `thalia-web` (Next.js)

## Objetivo
- Migrar a Next.js en `thalia-web` toda la superficie web existente en `thalia` (solo archivos `.web.tsx`) manteniendo la funcionalidad.
- Usar `Tailwind` para estilos, `Radix` para componentes base, `Schedule X` para calendario y `Supabase` como backend.
- Evitar prop drilling: estado compartido en `Zustand` y lectura directa del store en el nivel donde se consume.

## Contexto actual
- Origen: [D:\thalia](file:///D:/thalia/).
- Destino: [C:\Users\hardh\Documents\code\thalia-web](file:///C:/Users/hardh/Documents/code/thalia-web/).
- El destino ahora mismo es scaffold mínimo (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`).
- Dependencias ya presentes en destino: `zustand`, `@radix-ui/themes`, `@schedule-x/calendar`, `@schedule-x/theme-default`.

## Alcance
- In scope:
  - Migración de rutas y componentes `*.web.tsx`.
  - Reescritura de UI RN-web a HTML/React + Tailwind + Radix.
  - Integración completa con Supabase (auth, datos, realtime, storage).
  - Normalización de estado global con Zustand para flujos compartidos.
- Out of scope:
  - Paridad móvil (iOS/Android).
  - Migración de pantallas sin variante `.web.tsx` en esta fase inicial.

## Inventario a migrar

### Rutas `.web.tsx` (origen)
- [D:\thalia\app\(auth)\login.web.tsx](file:///D:/thalia/app/%28auth%29/login.web.tsx)
- [D:\thalia\app\(auth)\register-employee.web.tsx](file:///D:/thalia/app/%28auth%29/register-employee.web.tsx)
- [D:\thalia\app\(onboarding)\create-clinic.web.tsx](file:///D:/thalia/app/%28onboarding%29/create-clinic.web.tsx)
- [D:\thalia\app\(onboarding)\invite-team.web.tsx](file:///D:/thalia/app/%28onboarding%29/invite-team.web.tsx)
- [D:\thalia\app\(app)\_layout.web.tsx](file:///D:/thalia/app/%28app%29/_layout.web.tsx)
- [D:\thalia\app\(app)\dashboard\_layout.web.tsx](file:///D:/thalia/app/%28app%29/dashboard/_layout.web.tsx)
- [D:\thalia\app\(app)\dashboard\index.web.tsx](file:///D:/thalia/app/%28app%29/dashboard/index.web.tsx)
- [D:\thalia\app\(app)\calendar\_layout.web.tsx](file:///D:/thalia/app/%28app%29/calendar/_layout.web.tsx)
- [D:\thalia\app\(app)\calendar\index.web.tsx](file:///D:/thalia/app/%28app%29/calendar/index.web.tsx)
- [D:\thalia\app\(app)\appointments\_layout.web.tsx](file:///D:/thalia/app/%28app%29/appointments/_layout.web.tsx)
- [D:\thalia\app\(app)\appointments\index.web.tsx](file:///D:/thalia/app/%28app%29/appointments/index.web.tsx)
- [D:\thalia\app\(app)\patients\_layout.web.tsx](file:///D:/thalia/app/%28app%29/patients/_layout.web.tsx)
- [D:\thalia\app\(app)\patients\index.web.tsx](file:///D:/thalia/app/%28app%29/patients/index.web.tsx)
- [D:\thalia\app\(app)\employees\_layout.web.tsx](file:///D:/thalia/app/%28app%29/employees/_layout.web.tsx)
- [D:\thalia\app\(app)\employees\index.web.tsx](file:///D:/thalia/app/%28app%29/employees/index.web.tsx)
- [D:\thalia\app\(app)\inventory\_layout.web.tsx](file:///D:/thalia/app/%28app%29/inventory/_layout.web.tsx)
- [D:\thalia\app\(app)\inventory\index.web.tsx](file:///D:/thalia/app/%28app%29/inventory/index.web.tsx)
- [D:\thalia\app\(app)\finances\_layout.web.tsx](file:///D:/thalia/app/%28app%29/finances/_layout.web.tsx)
- [D:\thalia\app\(app)\finances\index.web.tsx](file:///D:/thalia/app/%28app%29/finances/index.web.tsx)
- [D:\thalia\app\(app)\settings\_layout.web.tsx](file:///D:/thalia/app/%28app%29/settings/_layout.web.tsx)
- [D:\thalia\app\(app)\settings\index.web.tsx](file:///D:/thalia/app/%28app%29/settings/index.web.tsx)

### Componentes `.web.tsx` (origen)
- [D:\thalia\src\components\ui\app-date-picker-popover.web.tsx](file:///D:/thalia/src/components/ui/app-date-picker-popover.web.tsx)
- [D:\thalia\src\components\calendar\calendar-employee-filter.web.tsx](file:///D:/thalia/src/components/calendar/calendar-employee-filter.web.tsx)
- [D:\thalia\src\components\calendar\calendar-employee-picker-dropdown.web.tsx](file:///D:/thalia/src/components/calendar/calendar-employee-picker-dropdown.web.tsx)
- [D:\thalia\src\components\finances\finances-month-selector.web.tsx](file:///D:/thalia/src/components/finances/finances-month-selector.web.tsx)
- [D:\thalia\src\components\patients\new-patient-date-field.web.tsx](file:///D:/thalia/src/components/patients/new-patient-date-field.web.tsx)
- [D:\thalia\src\components\appointments\new-appointment-datetime-field.web.tsx](file:///D:/thalia/src/components/appointments/new-appointment-datetime-field.web.tsx)
- [D:\thalia\src\components\dashboard\dashboard-appointment-row.web.tsx](file:///D:/thalia/src/components/dashboard/dashboard-appointment-row.web.tsx)
- [D:\thalia\src\components\settings\settings-profile-panel.web.tsx](file:///D:/thalia/src/components/settings/settings-profile-panel.web.tsx)
- [D:\thalia\src\components\onboarding\onboarding-intro-pager.web.tsx](file:///D:/thalia/src/components/onboarding/onboarding-intro-pager.web.tsx)

## Arquitectura objetivo en `thalia-web`

### Estructura de carpetas
- `app/` para routing App Router.
- `src/components/{ui,auth,onboarding,dashboard,calendar,appointments,patients,employees,inventory,finances,settings}`.
- `src/stores` para Zustand por dominio.
- `src/lib/{supabase,hooks,utils}`.
- `src/data/{auth,appointments,patients,employees,inventory,finances,settings,calendar}` para acceso a datos.

### Mapeo de rutas destino
- `app/(auth)/login/page.tsx`
- `app/(auth)/register-employee/page.tsx`
- `app/(onboarding)/create-clinic/page.tsx`
- `app/(onboarding)/invite-team/page.tsx`
- `app/(app)/layout.tsx`
- `app/(app)/dashboard/page.tsx`
- `app/(app)/calendar/page.tsx`
- `app/(app)/appointments/page.tsx`
- `app/(app)/patients/page.tsx`
- `app/(app)/employees/page.tsx`
- `app/(app)/inventory/page.tsx`
- `app/(app)/finances/page.tsx`
- `app/(app)/settings/page.tsx`

## Estrategia de Supabase (backend obligatorio)

### Configuración
- Definir env vars en Next para URL y keys de Supabase.
- Configurar cliente browser/server:
  - `src/lib/supabase/client.ts`
  - `src/lib/supabase/server.ts`

### Auth y sesión
- Portar flujo de login/logout y sesión persistente.
- Implementar protección de rutas del grupo `(app)`.
- Mantener reglas de visibilidad por rol (admin/reception/doctor/auxiliary) en UI y data access.

### Capa de datos
- Mover consultas/mutaciones por dominio a `src/data/*`.
- Evitar llamadas de Supabase directas en componentes.
- Reutilizar patrones y lógica de hooks del proyecto origen cuando aplique.

### Realtime
- Mantener suscripciones en módulos críticos:
  - Calendario/citas.
  - Vistas que dependan de actualización casi en tiempo real.

### Storage
- Mantener flujo de ficheros/imágenes con Supabase Functions y URLs firmadas donde aplique.
- Conservar compatibilidad funcional de subida/lectura de archivos del origen.

## Estrategia de estado con Zustand (anti prop drilling)
- Stores base a crear/migrar:
  - `authStore`
  - `clinicStore`
  - `topbarSearchStore`
  - `calendarStore`
  - `appointmentsStore`
  - `patientsStore`
  - `employeesStore`
  - `inventoryStore`
  - `financesStore`
  - `settingsStore`
- Regla de implementación:
  - Si un componente intermedio no consume una prop, no la recibe ni la pasa.
  - El componente que la consume accede directamente al store con selector.
- Selector por slice para reducir renders innecesarios.

## Plan de ejecución por fases

### Fase 0 - Preparación
- [x] Alinear `tsconfig` para alias apuntando a `src`.
- [x] Crear estructura base de `src` por dominio.
- [x] Definir layout base y providers globales.

### Fase 1 - Base Supabase
- [x] Implementar `client.ts` y `server.ts` de Supabase.
- [x] Configurar sesión y guard de rutas.
- [x] Migrar lógica base de auth desde origen.
- [ ] Crear primeros módulos `src/data/auth` y `src/data/clinic`.

### Fase 2 - Shell + auth/onboarding
- [x] Migrar layout principal web (`_layout.web.tsx`) a `app/(app)/layout.tsx`.
- [x] Migrar `login`, `register-employee`, `create-clinic`, `invite-team`.
- [x] Rehacer UI con Tailwind + Radix manteniendo comportamiento.

### Fase 3 - Módulos core (listas/paneles)
- [x] Migrar dashboard y su fila de cita.
- [x] Migrar appointments (index).
- [x] Migrar patients (index).
- [x] Migrar employees (index).
- [x] Migrar inventory (index).
- [x] Migrar finances (index + selector mensual).
- [x] Migrar settings (index + panel perfil).

### Fase 4 - Calendario
- [x] Integrar Schedule X en `app/(app)/calendar/page.tsx`.
- [x] Migrar filtros de empleado (`calendar-employee-filter` y dropdown).
- [x] Conectar selección temporal/empleado al `calendarStore`.
- [x] Conectar datos de citas/empleados vía Supabase.

### Fase 5 - Componentes de fecha y formularios web
- [x] Migrar `app-date-picker-popover.web.tsx`.
- [x] Migrar `new-patient-date-field.web.tsx`.
- [x] Migrar `new-appointment-datetime-field.web.tsx`.
- [ ] Asegurar consistencia de formato y zona horaria con Supabase.

### Fase 6 - Refactor global anti drilling
- [ ] Revisar cada dominio migrado para eliminar props puente.
- [ ] Pasar estado compartido restante a stores de dominio.
- [ ] Consolidar selectors y acciones por store.

### Fase 7 - Cierre funcional
- [ ] Verificar paridad funcional de rutas `.web.tsx` migradas.
- [ ] Verificar permisos por rol en cada módulo.
- [ ] Verificar realtime y operaciones críticas de Supabase.
- [ ] Documentar gaps pendientes fuera de alcance (pantallas sin `.web.tsx`).

## Checklist por dominio

### Auth
- [x] Login funcional con Supabase.
- [x] Registro de empleado adaptado a flujo existente.
- [x] Guards correctos entre rutas públicas y protegidas.

### Onboarding
- [x] Alta de clínica.
- [x] Invitación de equipo.

### Dashboard
- [x] Carga de datos y acciones rápidas.
- [x] Render de citas del día.

### Calendar
- [x] Vista de calendario operativa con Schedule X.
- [x] Filtro por empleado.
- [x] Navegación por rango temporal.

### Appointments / Patients / Employees / Inventory / Finances / Settings
- [x] Listados equivalentes al origen.
- [x] Filtros y búsquedas con estado global cuando sea compartido.
- [ ] Integración completa con `src/data/*` y Supabase.

## Criterios de aceptación
- [x] Todas las rutas `.web.tsx` inventariadas tienen su equivalente en Next.
- [x] UI migrada usa Tailwind + Radix de forma consistente.
- [x] Calendario funciona sobre Schedule X con estado global en Zustand.
- [ ] No existe prop drilling innecesario en componentes migrados.
- [ ] Supabase es el backend efectivo en auth, datos, realtime y storage con paridad funcional respecto a `thalia`.

## Riesgos y mitigación
- Diferencias Expo Router vs App Router: resolver mapeo de rutas al inicio.
- Diferencias RN-web vs DOM: priorizar paridad funcional primero y ajustar UI después.
- Complejidad de calendario: aislar integración Schedule X en fase dedicada.
- Acoplamiento por props heredado: revisión explícita en fase de refactor global.

## Orden recomendado de ejecución inmediata
1. Fase 0
2. Fase 1
3. Fase 2
4. Fase 3
5. Fase 4
6. Fases 5, 6 y 7
