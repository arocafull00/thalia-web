export type FinancesTabValue = "income" | "expense" | "summary";

type FinancesTabBarProps = {
  selectedTab: FinancesTabValue;
  onTabChange: (tab: FinancesTabValue) => void;
};

export default function FinancesTabBar({ selectedTab, onTabChange }: FinancesTabBarProps) {
  const tabs: FinancesTabValue[] = ["income", "expense", "summary"];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide ${
            selectedTab === tab ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {tab === "income" ? "Ingresos" : tab === "expense" ? "Gastos" : "Resumen"}
        </button>
      ))}
    </div>
  );
}
