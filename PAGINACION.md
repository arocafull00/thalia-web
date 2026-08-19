# Paginación en servidor

Notas de cómo se pagina en Thalia y por qué cada pantalla lo hace como lo hace.
Sirve de guía para las que faltan (#56 pacientes, #41 imágenes, #36 el resto).

El objetivo común es dejar de traerse el listado entero de la clínica y pedir
solo la página visible, con el recuento total resuelto en base de datos.

---

## La regla de oro

**Si filtras en el cliente, no puedes paginar en el servidor.**

Al pedir 10 filas y descartar 4 en el navegador, muestras 6 y el paginador
miente. Filtros, búsqueda y orden tienen que viajar al servidor, siempre.

De ahí sale la única pregunta que decide la dificultad de cada pantalla:

> ¿La búsqueda mira columnas de una sola tabla, o de varias?

---

## Caso A — la búsqueda mira una sola tabla

Es el caso fácil. Se consulta la tabla directamente:

```ts
.select("*", { count: "exact" })
.ilike("name", `%${search}%`)
.order("name")
.range(offset, offset + pageSize - 1)
```

`count: "exact"` devuelve el total sin traer las filas. Es el patrón que ya
usaban `patient-files.dal.ts` y `patient-images.dal.ts`.

**Pantallas en este caso:** tratamientos (busca por nombre, filtra por
categoría), pacientes (busca por nombre y teléfono, filtra por
`marketing_opt_in`), y previsiblemente inventario.

Ojo con el `or` de PostgREST cuando la búsqueda mira **varias columnas de la
misma tabla**: eso sí se puede, y es el caso de pacientes.

```ts
.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)
```

Lo que no se puede es cruzar columnas de **relaciones** distintas. Esa es la
frontera entre el caso A y el B.

---

## Caso B — la búsqueda cruza varias tablas

Es el caso de **citas**: al escribir se busca en el nombre del paciente, en su
teléfono y en el nombre del tratamiento. Tres tablas distintas.

PostgREST no sabe hacer un `OR` entre columnas de relaciones diferentes, así
que no hay forma de expresar ese filtro en una consulta normal.

**Solución:** una vista que aplana los campos buscables en una sola columna de
texto. Ver `supabase/migrations/20260810000001_appointments_search_view.sql`.

Dos cosas que no se pueden olvidar al crear una vista así:

1. **`WITH (security_invoker = true)`**. Sin eso, la vista se ejecuta con los
   permisos de su propietario y se salta el RLS: devolvería filas de todas las
   clínicas sin dar ningún error. Es una fuga silenciosa.
2. **Se consulta en dos pasos.** La vista dice *qué ids* cumplen los filtros y
   en qué orden; el payload completo se lee después de la tabla real con su
   select anidado. Una vista no tiene claves foráneas y PostgREST no puede
   embeber relaciones desde ella. La segunda consulta trae como mucho
   `pageSize` filas, así que el viaje extra es barato.

---

## Trampas que ya nos han mordido

### El orden necesita desempate

```ts
.order("starts_at", { ascending: false })
.order("id", { ascending: false })   // ← imprescindible
```

Sin la segunda línea, dos filas con la misma fecha pueden intercambiarse entre
consultas. Resultado: una fila aparece en dos páginas y otra no aparece en
ninguna.

### Los filtros derivados de la lista se rompen

Si un desplegable se construye recorriendo los elementos cargados, con
paginación solo verá los de la página actual.

Ejemplo real en tratamientos: `useFilterPills(items)` saca las categorías de la
lista. Con 40 tratamientos en tres categorías, si la primera página trae 10 que
resultan ser todos «Faciales», el desplegable ofrecería solo esa y no podrías
filtrar por las otras dos.

**Solución:** pedir esos valores aparte, con su propia consulta que recorra
toda la clínica pero traiga solo la columna necesaria.

### Refrescar después de crear, editar o borrar

Los stores suelen volver a pedir *la lista entera* tras una mutación. Con
paginación hay que volver a pedir **la página activa y el total**: si borras
una fila, «1-10 de 40» pasa a «de 39». Parchear el elemento en memoria no basta.

Lo mismo aplica al realtime, si la pantalla lo tiene.

### Cuidado con las cachés compartidas

En citas, la caché `byRange` del store la usan tres hooks del calendario, que
necesitan **todas** las citas de un rango para pintar la rejilla. Convertirla en
paginada habría roto el calendario, así que la paginación vive en una caché
aparte, `byPage`.

Antes de tocar un store, mirar quién más lo consume.

### El «¿hay algo?» deja de poder deducirse de las filas

Varias pantallas deciden qué pintar con `items.length > 0`: estado vacío
invitando a crear el primero, o la lista con su barra de filtros. Con
paginación esas filas son **sólo la página**, y además ya vienen filtradas.

En campañas la barra de filtros se renderizaba condicionada a eso. Filtrar
hasta cero resultados la habría hecho desaparecer, dejando al usuario sin forma
de deshacer el filtro.

**Solución:** deducirlo del total y dar por hecho que hay datos cuando hay
filtros activos.

```ts
const hasCampaigns = hasActiveFilters || total > 0;
```

### Los rangos de fecha se resuelven en la zona de la clínica

Un filtro `YYYY-MM-DD` contra una columna `timestamptz` necesita convertirse a
instantes. Hacerlo con `new Date(...)` usa la zona de quien ejecuta: el
navegador en el cliente, casi siempre UTC en el servidor. Los dos calcularían
límites distintos y la siembra traería un recorte que no es el que se muestra.

Se resuelve con `clinicWallFieldsToIso` y `CLINIC_TIME_ZONE`, que dan el mismo
resultado en ambos lados. Y `to` abarca el día entero: sin eso, filtrar por un
solo día no devuelve nada.

**Validar la fecha antes de convertirla.** `\d{4}-\d{2}-\d{2}` acepta
`2026-13-99`, y `clinicWallFieldsToIso` lanza `RangeError` con un valor
imposible. Como el filtro viene de la URL, eso es una pantalla en blanco a un
query string de distancia.

### Un filtro que no filtra nada real no se puede paginar

En pacientes había un desplegable «Estado del paciente» con Activos/Inactivos
que se resolvía así en cliente:

```ts
if (filters.status === "inactive") return [];   // siempre vacío
return patientData;                             // "Activos" = todos
```

No existía ninguna columna detrás. Con paginación en servidor eso deja de ser
un adorno inofensivo y pasa a mentir: «Inactivos» mostraría cero filas mientras
el paginador dice «1-10 de 240».

Al migrar una pantalla hay que mirar **qué columna respalda cada filtro** antes
de nada. Si no la hay, el filtro se quita o se le da un significado real; en
pacientes se reconvirtió a `marketing_opt_in`, que sí es una columna.

### El valor por defecto no es el valor inicial

`useUrlFilters` devuelve un filtro a su valor por defecto cuando se borra de la
URL. Si ese defecto es «lo que traía la URL al cargar», el filtro no se puede
quitar: al elegir «Todos» vuelve al valor anterior.

Pasó con el selector de profesional en citas. El defecto de un filtro que se
puede limpiar tiene que ser el valor vacío.

---

## Dónde vive el estado de la página

**Pantallas de primer nivel** (citas, tratamientos, pacientes…): en la URL, con
`useUrlFilters`. Así recargar no te devuelve a la primera página y el enlace se
puede compartir.

**Pestañas dentro de un detalle** (galería del paciente): en `useState`. No
tiene sentido llenar la URL con el estado de una pestaña.

Son dos patrones distintos a propósito.

### La URL se escribe sin navegar

`useUrlFilters` usa `window.history.replaceState`, no `router.replace`. El
segundo es una navegación: Next vuelve a ejecutar el Server Component y repite
las consultas en cada tecleo. Se midió en citas: **1137 ms por cambio de
página**.

Desde Next 14.1 el framework integra `pushState`/`replaceState` en su router,
así que `useSearchParams` se sincroniza igual pero sin tocar el servidor.

Consecuencia buscada: el Server Component siembra la primera carga y los
refrescos (F5); a partir de ahí manda el cliente y su caché.

---

## Piezas compartidas

- **`DataTable`** acepta `manualPagination` opcional: `{ pageIndex, pageSize,
  total, onPageChange }`. Sin esa prop sigue paginando en cliente, que es lo que
  hacen inventario y campañas.
- **Siembra desde servidor con clave**: el Server Component resuelve la primera
  página y pasa la consulta que usó. Si no coincide con la que calcula el
  cliente, `useServerSeed` la descarta y refetchea. Nunca sembrar una página
  distinta de la que se va a mostrar.
- **Cambiar cualquier filtro vuelve a la página 1.** Quedarse en la 5 tras
  filtrar deja la tabla vacía sin explicar por qué. Eso incluye **la búsqueda y
  el sheet móvil**, que es fácil olvidar: la búsqueda no pasa por el `onChange`
  del filtro sino por `useFilterSearch`, así que hay que pasarle el setter que
  resetea la página, no `setFilter` a secas. Citas y tratamientos se quedaron
  sin ese detalle al migrarlas y se corrigió después.
- **Sin orden en cliente.** Si la tabla pagina en servidor, `enableSorting` va
  desactivado: ordenar las 10 filas visibles da una impresión falsa de orden
  global. `DataTable` pasa `enableSorting` a la tabla de forma explícita para
  que `SortableTableHead` pinte texto plano en vez de un botón inerte.
- **Resetear la caché al cambiar de clínica.** `resetClinicQueryData` tiene que
  vaciar también `byPage` y cualquier consulta auxiliar (las categorías de
  tratamientos, por ejemplo), o la clínica nueva hereda las filas de la vieja.
- **El tamaño de página** de citas está en `src/lib/appointment-pagination.ts`,
  en módulo propio: lo necesitan el cliente y el Server Component, y importar el
  hook desde el servidor arrastraría React al bundle de servidor.

---

## Estado

| Pantalla | Caso | Estado |
|---|---|---|
| Citas (#55) | B — vista SQL | Hecho, tamaño 10 |
| Imágenes de paciente | A | Hecho, tamaño 24, estado en `useState` |
| Archivos de paciente | A | Hecho, tamaño 20 |
| Tratamientos (#57) | A | Hecho, tamaño 10. Sin vista; categorías en consulta aparte |
| Pacientes (#56) | A | Hecho, tamaño 10. Sin vista; el filtro de estado pasó a `marketing_opt_in` |
| Campañas (#72) | A | Hecho, tamaño 10. Sin lista completa: el store solo cachea páginas |
| Personal (#73) | A | Hecho, tamaño 10. `list` conservada para calendario y citas |
| Materiales (#70) | B — filtro de stock cruza dos columnas | Pendiente |
| Finanzas (#71) | A | Pendiente |
| Citas de un empleado (#74) | — | Pendiente, hoy `.limit(50)` fijo |
| Movimientos de un material (#75) | — | Pendiente |
| Citas de un paciente (#76) | — | Pendiente, agregados acoplados |

**Pendiente transversal:** los tamaños de página están repartidos por dominio
(10, 20, 24). Con cinco pantallas ya en 10, toca unificarlos en una constante
compartida.

**Pendiente transversal:** ninguna pantalla sembrada desde servidor maneja el
error de red. Un `fetch failed` en el Server Component revienta el render en
lugar de caer en el `Notice` de «no se pudieron cargar».

### Booleanos que admiten nulos

`employees.active` es `BOOLEAN DEFAULT true`, es decir, **nullable**, y el
filtro en cliente trataba el nulo como activo (`active !== false`). Traducirlo a
`.eq("active", true)` habría hecho desaparecer del listado a los empleados
antiguos que nunca tuvieron el campo puesto.

```ts
.not("active", "is", false)   // activos: TRUE o NULL
.is("active", false)          // inactivos
```

Antes de mover un filtro booleano al servidor, mirar si la columna admite nulos
y qué hacía el cliente con ellos.
