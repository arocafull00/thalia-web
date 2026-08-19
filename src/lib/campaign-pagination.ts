import { clinicWallFieldsToIso } from "@/lib/appointment-datetime";
import { CLINIC_TIME_ZONE } from "@/lib/constants";

/**
 * Tamaño de página del listado de campañas.
 *
 * Vive en su propio módulo, y no en el hook, porque lo necesitan tanto el
 * cliente como el Server Component que siembra la primera página: importar el
 * hook desde el servidor arrastraría React al bundle de servidor.
 */
export const CAMPAIGNS_PAGE_SIZE = 10;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** El patrón acepta `2026-13-99`, así que hay que comprobar el calendario. */
function isRealDate(year: number, month: number, day: number) {
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function toBound(
  value: string,
  endOfDay: boolean,
  timezone: string,
): string | null {
  if (!DATE_PATTERN.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  // Un valor imposible llega desde la URL, que el usuario puede escribir a
  // mano. Sin este corte, `clinicWallFieldsToIso` lanza `RangeError` y tumba el
  // render del Server Component: pantalla en blanco por un query string.
  if (!isRealDate(year, month, day)) {
    return null;
  }

  try {
    return clinicWallFieldsToIso(
      endOfDay
        ? {
            year,
            month,
            day,
            hour: 23,
            minute: 59,
            second: 59,
            millisecond: 999,
          }
        : { year, month, day, hour: 0, minute: 0 },
      timezone,
    );
  } catch {
    // La medianoche no existe en toda zona horaria: si el cambio de hora cae
    // ahí, mejor no filtrar por ese extremo que romper la pantalla.
    return null;
  }
}

/**
 * Convierte el rango `YYYY-MM-DD` del filtro en instantes ISO para comparar
 * contra `created_at`, que es un `timestamptz`.
 *
 * Se resuelve en la zona de la clínica y no en la del navegador para que el
 * cliente y el Server Component que siembra calculen exactamente los mismos
 * límites: si difirieran, la siembra traería un recorte distinto del que
 * mostraría el cliente.
 *
 * `to` abarca el día entero; si no, filtrar por un solo día no devolvería nada.
 */
export function campaignDateRangeToIso(
  from: string,
  to: string,
  timezone: string = CLINIC_TIME_ZONE,
) {
  return {
    createdFrom: toBound(from, false, timezone),
    createdTo: toBound(to, true, timezone),
  };
}
