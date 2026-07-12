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
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
            selectedTab === tab
              ? "bg-primary-subtle text-primary"
              : "text-ink-muted hover:bg-[var(--hover-overlay)] hover:text-ink-secondary"
          }`}
        >
          {tab === "income"
            ? "Ingresos"
            : tab === "expense"
              ? "Gastos"
              : "Resumen"}
        </button>
      ))}
    </div>
  );
}
