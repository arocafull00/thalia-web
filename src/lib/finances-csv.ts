import type { Transaction } from "@/types/database.types";

const CSV_SEPARATOR = ";";
const CSV_LINE_BREAK = "\r\n";
const UTF8_BOM = "\uFEFF";
const FORMULA_PREFIX = /^\s*[=+\-@]/;

function neutralizeFormula(value: string) {
  return FORMULA_PREFIX.test(value) ? `'${value}` : value;
}

function quoteCsvText(value: string) {
  const normalized = neutralizeFormula(value).replace(/\r?\n/g, CSV_LINE_BREAK);
  return `"${normalized.replaceAll('"', '""')}"`;
}

function formatCsvDate(value: string | null) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function formatCsvAmount(value: number) {
  return value.toFixed(2).replace(".", ",");
}

export function transactionsToCsv(transactions: Transaction[]) {
  const header = ["Fecha", "Tipo", "Categoría", "Concepto", "Importe (€)"]
    .map(quoteCsvText)
    .join(CSV_SEPARATOR);
  const rows = transactions.map((transaction) =>
    [
      quoteCsvText(formatCsvDate(transaction.date)),
      quoteCsvText(transaction.type === "income" ? "Cobro" : "Gasto"),
      quoteCsvText(transaction.category?.name ?? "Sin categoría"),
      quoteCsvText(transaction.description ?? ""),
      formatCsvAmount(transaction.amount),
    ].join(CSV_SEPARATOR),
  );

  return `${UTF8_BOM}${[header, ...rows].join(CSV_LINE_BREAK)}`;
}

export function downloadFinancesCsv(csv: string, from: string, to: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `finanzas_${from}_a_${to}.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
