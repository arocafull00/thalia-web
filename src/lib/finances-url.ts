import type { FinancesTabValue } from "@/components/finances/finances-tab-bar";

export function parseFinancesTabParam(
  value: string | undefined,
): FinancesTabValue {
  if (value === "expense" || value === "summary") {
    return value;
  }

  return "income";
}
