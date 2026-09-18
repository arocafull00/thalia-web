import { Button } from "@/components/ui/button";

export type FinancesTabValue = "income" | "expense" | "summary";

type FinancesTabBarProps = {
  selectedTab: FinancesTabValue;
  onTabChange: (tab: FinancesTabValue) => void;
};

export default function FinancesTabBar({
  selectedTab,
  onTabChange,
}: FinancesTabBarProps) {
  const tabs: FinancesTabValue[] = ["income", "expense", "summary"];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <Button
          key={tab}
          type="button"
          variant="ghost"
          onClick={() => onTabChange(tab)}
          className={`rounded-full px-3 py-1.5 text-sm ${
            selectedTab === tab
              ? "bg-primary-subtle text-primary hover:bg-primary-subtle hover:text-primary"
              : "text-ink-muted hover:bg-(--hover-overlay) hover:text-ink-secondary"
          }`}
        >
          {tab === "income"
            ? "Ingresos"
            : tab === "expense"
              ? "Gastos"
              : "Resumen"}
        </Button>
      ))}
    </div>
  );
}
