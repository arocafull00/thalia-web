import type { AppointmentStockIssue } from "@/lib/appointment-stock";

function formatAmount(value: number, unit: string | null) {
  if (!unit) {
    return String(value);
  }

  return `${value} ${unit}`;
}

export const APPOINTMENT_STATUS_COPY = {
  genericError: "No se pudo actualizar el estado de la cita.",
  legacyStockError:
    "No hay stock suficiente para los materiales del tratamiento.",
  reviewStock: "Revisar stock",
  stockColumn: "Stock",
  stockShortLabel: "Stock",
  viewProduct: "Ver producto",
  stockError: (issue: AppointmentStockIssue) => {
    if (issue.shortageCount > 1) {
      return `No hay stock suficiente para el tratamiento: faltan ${issue.shortageCount} productos. Revisa ${issue.itemName}, el de mayor déficit.`;
    }

    const required = formatAmount(issue.requiredQuantity, issue.unit);
    const available = formatAmount(issue.availableStock, issue.unit);
    return `No hay stock suficiente para el tratamiento. De ${issue.itemName} se necesitan ${required} y hay ${available}.`;
  },
  reviewStockLabel: (issue: AppointmentStockIssue) =>
    issue.shortageCount > 1
      ? `Revisar stock de ${issue.itemName}, el producto con mayor déficit de ${issue.shortageCount}`
      : `Revisar stock de ${issue.itemName}`,
} as const;
