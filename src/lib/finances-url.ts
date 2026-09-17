import type { FinancesTabValue } from "@/components/finances/finances-tab-bar";
import type { FinancesViewValue } from "@/components/finances/finances-view-tab-bar";

export function parseFinancesTabParam(
  value: string | undefined,
): FinancesTabValue {
  if (value === "expense") {
    return value;
  }

  return "income";
}

export function parseFinancesViewParam(
  value: string | undefined,
): FinancesViewValue {
  if (value === "movements") {
    return value;
  }

  return "summary";
}
