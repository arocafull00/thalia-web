import type { AgendaAppointment } from "@/lib/calendar-agenda";
import type { AppointmentStatus } from "@/types/database.types";

/*
 * A partir de esta cantidad de citas simultáneas, las tarjetas pasan a su forma
 * compacta: una línea por cita en lugar del bloque con la hora grande.
 *
 * No hay tope de cuántas se muestran. Antes se recortaban a cuatro con un
 * enlace «y N más», y escondía justo lo que la pantalla tiene que contar: quién
 * está dentro ahora. Lo que se recorta es el detalle de cada una, no la lista.
 */
export const COMPACT_FROM = 4;

/*
 * Margen antes de avisar de que una cita en curso se ha pasado de su hora.
 *
 * Una cita que se alarga diez minutos es normal en una clínica, y avisar de eso
 * convertiría el aviso en ruido que nadie mira. Lo que esto detecta es la cita
 * que nadie cerró: nada en el sistema pasa una cita a completada por sí solo,
 * así que una cita sin marcar se queda en curso indefinidamente.
 */
export const OVERDUE_GRACE_MINUTES = 15;

/*
 * Tramos de la barra de jornada, en el orden en que se pintan: primero lo que
 * salió bien.
 *
 * Son los tres estados en los que una cita ya no va a cambiar. El hueco que
 * queda sin pintar es lo que falta por resolver, y eso es lo que hace que la
 * barra se lea sin leyenda: lo vacío es trabajo pendiente.
 */
export const DAY_SEGMENT_STATUSES = [
  "completed",
  "cancelled",
  "no_show",
] as const satisfies readonly AppointmentStatus[];

export type DaySegmentStatus = (typeof DAY_SEGMENT_STATUSES)[number];

/*
 * Una cita que el profesional externo rechazó nunca llegó a existir: la clínica
 * la propuso y le dijeron que no, así que ese hueco nunca estuvo reservado.
 * Contarla en el total de la jornada inflaría el denominador con trabajo que no
 * hubo. Una cancelada sí cuenta: fue una cita de verdad que se anuló.
 */
const NEVER_HAPPENED = "rejected_external";

/* Estados desde los que una cita todavía está por empezar. `in_progress` no
 * está porque ya ha empezado, y `no_show` tampoco porque ya no va a pasar. */
const UPCOMING_STATUSES = new Set([
  "scheduled",
  "confirmed",
  "pending_external",
]);

export type DashboardDayState =
  "in-progress" | "next" | "day-over" | "no-appointments";

export type InProgressAppointment = AgendaAppointment & {
  /** Minutos transcurridos desde su hora de fin. 0 si todavía no ha llegado. */
  overdueMinutes: number;
  /** `true` cuando pasa del margen de cortesía y conviene avisar. */
  overdue: boolean;
};

export type DaySegment = {
  status: DaySegmentStatus;
  count: number;
  /** Porcentaje sobre el total del día, para el ancho del tramo. */
  percent: number;
};

export type DashboardDay = {
  /** Todas las citas iniciadas ahora mismo, por hora de inicio. Sin recortar. */
  inProgress: InProgressAppointment[];
  /** `true` cuando hay tantas que cada tarjeta debe ir en su forma compacta. */
  compact: boolean;
  /** La siguiente por empezar. Solo cuando no hay ninguna en curso. */
  next: AgendaAppointment | null;
  /**
   * Lo que va en el listado de «Agenda de hoy», de la más reciente a la más
   * antigua. Sin las que están en curso: ya se ven arriba en sus tarjetas, y
   * repetirlas hace dudar de si son las mismas o dos citas distintas.
   */
  agenda: AgendaAppointment[];
  /** Tramos de la barra, siempre en el orden de `DAY_SEGMENT_STATUSES`. */
  segments: DaySegment[];
  completedCount: number;
  /** Denominador de la barra: las citas del día menos las nunca aceptadas. */
  totalCount: number;
  state: DashboardDayState;
};

/**
 * Reparte las citas de hoy en lo que la pantalla de Inicio necesita pintar.
 *
 * `now` entra por parámetro y no se lee del reloj aquí dentro para que la
 * función sea pura: es lo que permite afirmar en un test qué se ve a las 09:45
 * de un día concreto sin tocar el reloj del sistema.
 *
 * **«En curso» es el estado `in_progress`, nunca la hora comparada con el
 * reloj.** Una cita puede estar pasada de hora sin que nadie la haya iniciado;
 * pintarla como en curso diría que hay alguien en la sala cuando no lo hay.
 * `now` solo sirve para decidir cuál es la siguiente.
 */
export function buildDashboardDay(
  appointments: AgendaAppointment[],
  now: Date,
): DashboardDay {
  const byStart = [...appointments].sort(
    (left, right) => left.startsAt.getTime() - right.startsAt.getTime(),
  );

  const started = byStart
    .filter((appointment) => appointment.status === "in_progress")
    .map((appointment) => {
      const overdueMinutes = Math.max(
        0,
        (now.getTime() - appointment.endsAt.getTime()) / 60000,
      );

      return {
        ...appointment,
        overdueMinutes,
        overdue: overdueMinutes > OVERDUE_GRACE_MINUTES,
      };
    });

  const counted = byStart.filter(
    (appointment) => appointment.status !== NEVER_HAPPENED,
  );

  const next =
    counted.find(
      (appointment) =>
        UPCOMING_STATUSES.has(appointment.status ?? "") &&
        appointment.startsAt.getTime() >= now.getTime(),
    ) ?? null;

  const totalCount = counted.length;
  const segments = DAY_SEGMENT_STATUSES.map((status) => {
    const count = counted.filter(
      (appointment) => appointment.status === status,
    ).length;

    return {
      status,
      count,
      percent: totalCount === 0 ? 0 : (count / totalCount) * 100,
    };
  });

  return {
    inProgress: started,
    compact: started.length >= COMPACT_FROM,
    /* Si hay algo en curso, la siguiente sobra: lo que importa es lo de ahora. */
    next: started.length > 0 ? null : next,
    agenda: byStart
      .filter((appointment) => appointment.status !== "in_progress")
      .reverse(),
    segments,
    completedCount:
      segments.find((segment) => segment.status === "completed")?.count ?? 0,
    totalCount,
    state: resolveState(started.length, next, totalCount),
  };
}

/*
 * «Jornada terminada» y «hoy no hay citas» se separan a propósito. Son dos
 * situaciones distintas para quien mira: la primera es normal a las ocho de la
 * tarde, la segunda a las nueve de la mañana suele ser un error de agenda.
 */
function resolveState(
  startedCount: number,
  next: AgendaAppointment | null,
  totalCount: number,
): DashboardDayState {
  if (startedCount > 0) return "in-progress";
  if (next) return "next";
  if (totalCount > 0) return "day-over";
  return "no-appointments";
}
