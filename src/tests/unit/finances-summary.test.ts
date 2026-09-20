import { describe, expect, it } from "vitest";

import { buildFinancialSummary } from "@/lib/finances-summary";
import type { Transaction } from "@/types/database.types";

function movimiento(
  tipo: "income" | "expense",
  importe: number,
  categoria: string,
): Transaction {
  return {
    id: `${tipo}-${categoria}-${importe}`,
    clinic_id: "10000000-0000-4000-8000-000000000001",
    appointment_id: null,
    type: tipo,
    category_id: `cat-${categoria}`,
    amount: importe,
    description: null,
    date: "2026-09-10",
    created_by: "00000000-0000-4000-8000-000000000001",
    created_at: "2026-09-10T10:00:00Z",
    updated_at: "2026-09-10T10:00:00Z",
    category: {
      id: `cat-${categoria}`,
      type: tipo,
      name: categoria,
      is_active: true,
    },
  } as unknown as Transaction;
}

describe("resumen financiero", () => {
  /*
   * El porcentaje se calculaba sobre ingresos MÁS gastos. Con 3.000 € de
   * ingresos, todos de «Tratamientos», y 1.000 € de gastos, «Tratamientos»
   * salía al 75 % — cuando es el 100 % de lo que entró ese mes. La barra de
   * progreso pintaba esa cifra, así que el número no solo era raro: era falso.
   */
  it("calcula el porcentaje sobre el total de su propio tipo", () => {
    const resumen = buildFinancialSummary(
      [
        movimiento("income", 3000, "Tratamientos"),
        movimiento("expense", 1000, "Alquiler"),
      ],
      [],
    );

    expect(resumen.breakdown.income[0]).toMatchObject({
      category: "Tratamientos",
      percent: 100,
    });
    expect(resumen.breakdown.expense[0]).toMatchObject({
      category: "Alquiler",
      percent: 100,
    });
  });

  it("reparte el porcentaje entre las categorías del mismo tipo", () => {
    const resumen = buildFinancialSummary(
      [
        movimiento("income", 750, "Tratamientos"),
        movimiento("income", 250, "Productos"),
        movimiento("expense", 400, "Nóminas"),
      ],
      [],
    );

    expect(
      resumen.breakdown.income.map((entrada) => [
        entrada.category,
        entrada.percent,
      ]),
    ).toEqual([
      ["Tratamientos", 75],
      ["Productos", 25],
    ]);
  });

  /*
   * Un gasto no puede colarse en el desglose de ingresos ni al revés: es lo
   * que permite que el selector de tipo de la pantalla signifique algo.
   */
  it("no mezcla los tipos", () => {
    const resumen = buildFinancialSummary(
      [
        movimiento("income", 100, "Tratamientos"),
        movimiento("expense", 900, "Alquiler"),
      ],
      [],
    );

    expect(resumen.breakdown.income.map((e) => e.category)).toEqual([
      "Tratamientos",
    ]);
    expect(resumen.breakdown.expense.map((e) => e.category)).toEqual([
      "Alquiler",
    ]);
  });

  it("sigue sumando ingresos, gastos y neto", () => {
    const resumen = buildFinancialSummary(
      [
        movimiento("income", 1000, "Tratamientos"),
        movimiento("expense", 300, "Alquiler"),
      ],
      [],
    );

    expect(resumen.income).toBe(1000);
    expect(resumen.expenses).toBe(300);
    expect(resumen.net).toBe(700);
  });
});
