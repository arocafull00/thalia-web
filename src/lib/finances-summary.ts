import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

import type { FinancialSummary } from "@/stores/finances-store";
import type { Transaction } from "@/types/database.types";

export function buildFinancialSummary(
  current: Transaction[],
  previousTransactions: Transaction[],
): FinancialSummary {
  const income = current
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenses = current
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const previousNet = previousTransactions.reduce((total, transaction) => {
    return (
      total +
      (transaction.type === "income" ? transaction.amount : -transaction.amount)
    );
  }, 0);
  const net = income - expenses;

  return {
    income,
    expenses,
    net,
    previousNet,
    difference: net - previousNet,
    weekly: [0, 1, 2, 3, 4].map((week) => {
      const weekTransactions = current.filter((transaction) => {
        const day = Number(transaction.date?.slice(8, 10) ?? 1);
        return Math.floor((day - 1) / 7) === week;
      });

      return {
        week: week + 1,
        income: weekTransactions
          .filter((transaction) => transaction.type === "income")
          .reduce((total, transaction) => total + transaction.amount, 0),
        expenses: weekTransactions
          .filter((transaction) => transaction.type === "expense")
          .reduce((total, transaction) => total + transaction.amount, 0),
      };
    }),
  };
}

export function parseFinancesMonthParam(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return new Date();
  }

  return new Date(`${value}-01T00:00:00`);
}

export function formatFinancesMonthParam(month: Date) {
  return format(month, "yyyy-MM");
}

export function financesMonthRange(month: Date) {
  return {
    from: format(startOfMonth(month), "yyyy-MM-dd"),
    to: format(endOfMonth(month), "yyyy-MM-dd"),
  };
}

export function financesPreviousMonthRange(month: Date) {
  const previousMonth = subMonths(month, 1);

  return {
    from: format(startOfMonth(previousMonth), "yyyy-MM-dd"),
    to: format(endOfMonth(previousMonth), "yyyy-MM-dd"),
  };
}
