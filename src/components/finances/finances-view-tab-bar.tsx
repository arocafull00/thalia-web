import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FINANCES_COPY } from "@/copy/finances-copy";

export type FinancesViewValue = "summary" | "movements";

export default function FinancesViewTabBar() {
  return (
    <TabsList
      variant="line"
      aria-label={FINANCES_COPY.title}
      className="no-scrollbar w-full shrink-0 justify-start overflow-x-auto border-b border-border-subtle bg-surface"
    >
      <TabsTrigger
        value="summary"
        className="shrink-0 rounded-none px-4 py-3 text-[0.8rem] font-medium whitespace-nowrap"
      >
        {FINANCES_COPY.views.summary}
      </TabsTrigger>
      <TabsTrigger
        value="movements"
        className="shrink-0 rounded-none px-4 py-3 text-[0.8rem] font-medium whitespace-nowrap"
      >
        {FINANCES_COPY.views.movements}
      </TabsTrigger>
    </TabsList>
  );
}
