import { describe, expect, it } from "vitest";

import type { AgendaAppointment } from "@/lib/calendar-agenda";
import {
  COMPACT_FROM,
  OVERDUE_GRACE_MINUTES,
  buildDashboardDay,
} from "@/lib/dashboard-day";
import type { AppointmentStatus } from "@/types/database.types";

const HOY = "2026-10-09";
const AHORA = new Date(`${HOY}T09:45:00Z`);

function cita(
  hora: string,
  status: AppointmentStatus,
  nombre = `Paciente ${hora}`,
  fin = hora,
): AgendaAppointment {
  return {
    id: `${hora}-${status}`,
    startsAt: new Date(`${HOY}T${hora}:00Z`),
    endsAt: new Date(`${HOY}T${fin}:00Z`),
    patientName: nombre,
    treatmentName: "Tratamiento",
    employeeName: "Profesional",
    employeeColor: null,
    status,
    stockIssue: null,
    amount: null,
  };
}

describe("reparto del día en Inicio", () => {
  /*
   * El caso que motivó el diseño: dos profesionales atienden a la vez, así que
   * «la cita en curso» no es una. Si esto devolviera una sola, la pantalla
   * ocultaría que hay alguien más en consulta.
   */
  it("devuelve todas las citas en curso, no solo la primera", () => {
    const day = buildDashboardDay(
      [
        cita("09:30", "in_progress", "Lucía"),
        cita("09:30", "in_progress", "Marta"),
        cita("11:00", "scheduled"),
      ],
      AHORA,
    );

    expect(day.state).toBe("in-progress");
    expect(day.inProgress.map((c) => c.patientName)).toEqual([
      "Lucía",
      "Marta",
    ]);
    expect(day.compact).toBe(false);
  });

  it("ordena las citas en curso por hora de inicio", () => {
    const day = buildDashboardDay(
      [
        cita("10:00", "in_progress", "Tarde"),
        cita("08:00", "in_progress", "Temprano"),
      ],
      AHORA,
    );

    expect(day.inProgress.map((c) => c.patientName)).toEqual([
      "Temprano",
      "Tarde",
    ]);
  });

  /*
   * Antes se recortaban a cuatro con un enlace «y N más», y eso escondía justo
   * lo que la pantalla tiene que contar: quién está dentro ahora. Lo que se
   * recorta es el detalle de cada tarjeta, no la lista.
   */
  it("no recorta: devuelve las diez en curso y pide forma compacta", () => {
    const horas = [
      "08:00",
      "08:30",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
    ];
    const day = buildDashboardDay(
      horas.map((hora) => cita(hora, "in_progress")),
      AHORA,
    );

    expect(day.inProgress).toHaveLength(10);
    expect(day.compact).toBe(true);
  });

  it("pide forma compacta justo al llegar al umbral", () => {
    const enCurso = (n: number) =>
      buildDashboardDay(
        Array.from({ length: n }, (_, i) =>
          cita(`0${i}:00`.slice(-5), "in_progress"),
        ),
        AHORA,
      ).compact;

    expect(enCurso(COMPACT_FROM - 1)).toBe(false);
    expect(enCurso(COMPACT_FROM)).toBe(true);
  });

  /*
   * Si una cita en curso saliera también en el listado, habría que mirar la
   * hora para saber si es la misma de arriba o una segunda cita del día.
   */
  it("saca del listado las citas en curso", () => {
    const day = buildDashboardDay(
      [
        cita("09:30", "in_progress", "Dentro"),
        cita("08:00", "completed", "Hecha"),
        cita("12:00", "scheduled", "Luego"),
      ],
      AHORA,
    );

    expect(day.agenda.map((c) => c.patientName)).not.toContain("Dentro");
    expect(day.agenda).toHaveLength(2);
  });

  it("ordena el listado de la más reciente a la más antigua", () => {
    const day = buildDashboardDay(
      [
        cita("08:00", "completed", "Primera"),
        cita("12:00", "scheduled", "Ultima"),
        cita("10:00", "completed", "Media"),
      ],
      AHORA,
    );

    expect(day.agenda.map((c) => c.patientName)).toEqual([
      "Ultima",
      "Media",
      "Primera",
    ]);
  });

  /*
   * Una cancelada no cuenta en la jornada pero sí sale en el listado:
   * recepción necesita ver que esa hora se anuló, no que nunca existió.
   */
  it("muestra las canceladas en el listado aunque no cuenten en la jornada", () => {
    const day = buildDashboardDay(
      [cita("10:00", "cancelled", "Anulada"), cita("08:00", "completed")],
      AHORA,
    );

    expect(day.agenda.map((c) => c.patientName)).toContain("Anulada");
    expect(day.totalCount).toBe(2);
  });

  /*
   * «En curso» es el estado, nunca la hora comparada con el reloj. Una cita de
   * las 09:00 que nadie ha iniciado sigue estando por empezar: pintarla como en
   * curso diría que hay alguien en la sala cuando no lo hay.
   */
  it("no toma por iniciada una cita pasada de hora que nadie inició", () => {
    const day = buildDashboardDay([cita("09:00", "confirmed")], AHORA);

    expect(day.inProgress).toEqual([]);
    expect(day.state).toBe("day-over");
  });

  it("sin nada en curso, propone la siguiente por empezar", () => {
    const day = buildDashboardDay(
      [
        cita("08:00", "completed"),
        cita("12:00", "scheduled", "Tarde"),
        cita("10:30", "confirmed", "Pronto"),
      ],
      AHORA,
    );

    expect(day.state).toBe("next");
    expect(day.next?.patientName).toBe("Pronto");
  });

  it("con algo en curso no propone siguiente: lo que importa es lo de ahora", () => {
    const day = buildDashboardDay(
      [cita("09:30", "in_progress"), cita("11:00", "scheduled")],
      AHORA,
    );

    expect(day.next).toBeNull();
  });

  /*
   * Jornada terminada y día sin citas se separan a propósito: a las nueve de la
   * mañana, lo segundo suele ser un error de agenda y no una mañana tranquila.
   */
  it("distingue jornada terminada de día sin citas", () => {
    expect(buildDashboardDay([cita("08:00", "completed")], AHORA).state).toBe(
      "day-over",
    );
    expect(buildDashboardDay([], AHORA).state).toBe("no-appointments");
  });

  /*
   * La cancelada SÍ entra en el total, porque es un tramo de la barra: fue una
   * cita de verdad que se anuló. La rechazada por un externo no, porque ese
   * hueco nunca estuvo reservado: la clínica lo propuso y le dijeron que no.
   */
  it("cuenta las canceladas en el total pero no las rechazadas", () => {
    const day = buildDashboardDay(
      [
        cita("08:00", "completed"),
        cita("10:00", "cancelled"),
        cita("11:00", "rejected_external"),
        cita("12:00", "scheduled"),
      ],
      AHORA,
    );

    expect(day.totalCount).toBe(3);
    expect(day.completedCount).toBe(1);
  });

  it("reparte los tres tramos sobre el total del día", () => {
    const day = buildDashboardDay(
      [
        cita("08:00", "completed"),
        cita("08:30", "completed"),
        cita("09:00", "cancelled"),
        cita("09:15", "no_show"),
      ],
      AHORA,
    );

    expect(day.segments.map((s) => [s.status, s.count, s.percent])).toEqual([
      ["completed", 2, 50],
      ["cancelled", 1, 25],
      ["no_show", 1, 25],
    ]);
  });

  /*
   * Lo que queda sin pintar es el trabajo pendiente, así que la suma de los
   * tramos no debe llegar al 100 % mientras haya citas por resolver.
   */
  it("deja hueco en la barra para lo que falta por resolver", () => {
    const day = buildDashboardDay(
      [cita("08:00", "completed"), cita("12:00", "scheduled")],
      AHORA,
    );

    const pintado = day.segments.reduce((total, s) => total + s.percent, 0);
    expect(pintado).toBe(50);
  });

  it("sin citas, los tramos van a cero y no dividen por cero", () => {
    const day = buildDashboardDay([], AHORA);

    expect(day.totalCount).toBe(0);
    expect(day.segments.every((s) => s.count === 0 && s.percent === 0)).toBe(
      true,
    );
  });

  it("mantiene el orden de los tramos aunque falten algunos", () => {
    const day = buildDashboardDay([cita("09:00", "no_show")], AHORA);

    expect(day.segments.map((s) => s.status)).toEqual([
      "completed",
      "cancelled",
      "no_show",
    ]);
  });

  it("una cancelada no puede ser la siguiente", () => {
    const day = buildDashboardDay(
      [cita("10:00", "cancelled"), cita("11:00", "scheduled", "Buena")],
      AHORA,
    );

    expect(day.next?.patientName).toBe("Buena");
  });

  /*
   * Un `no_show` ya no va a pasar, pero ocupó un hueco de la jornada: cuenta en
   * el total y no puede ser la siguiente.
   */
  it("un no_show cuenta en la jornada pero no es la siguiente", () => {
    const day = buildDashboardDay([cita("12:00", "no_show")], AHORA);

    expect(day.totalCount).toBe(1);
    expect(day.completedCount).toBe(0);
    expect(day.next).toBeNull();
    expect(day.state).toBe("day-over");
  });

  /*
   * Nada en el sistema pasa una cita a completada por sí solo, así que una que
   * nadie cierre se queda en curso indefinidamente. El aviso lo cuenta sin
   * cerrarla: completar descuenta inventario y crea un ingreso en finanzas, y
   * eso lo decide una persona.
   */
  describe("citas en curso que nadie cerró", () => {
    it("avisa de la que lleva horas pasada de su hora de fin", () => {
      const day = buildDashboardDay(
        [cita("06:00", "in_progress", "Olvidada", "07:00")],
        AHORA,
      );

      expect(day.inProgress[0].overdue).toBe(true);
      expect(day.inProgress[0].overdueMinutes).toBe(165);
    });

    it("no avisa de la que va en hora", () => {
      const day = buildDashboardDay(
        [cita("09:30", "in_progress", "En curso", "10:30")],
        AHORA,
      );

      expect(day.inProgress[0].overdue).toBe(false);
      expect(day.inProgress[0].overdueMinutes).toBe(0);
    });

    /*
     * Una cita que se alarga diez minutos es normal en una clínica. Avisar de
     * eso convertiría el aviso en ruido que nadie mira.
     */
    it("respeta el margen de cortesía", () => {
      const pasada = (minutos: number) => {
        const fin = new Date(AHORA.getTime() - minutos * 60000);
        const hhmm = fin.toISOString().slice(11, 16);
        return buildDashboardDay(
          [cita("08:00", "in_progress", "X", hhmm)],
          AHORA,
        ).inProgress[0];
      };

      expect(pasada(OVERDUE_GRACE_MINUTES - 1).overdue).toBe(false);
      expect(pasada(OVERDUE_GRACE_MINUTES + 1).overdue).toBe(true);
    });
  });
});
