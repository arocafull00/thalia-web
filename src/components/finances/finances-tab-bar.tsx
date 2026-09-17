import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FINANCES_COPY } from "@/copy/finances-copy";

export type FinancesTabValue = "income" | "expense";

export default function FinancesTabBar() {
  return (
    <TabsList variant="default" className="h-auto gap-1 bg-transparent p-0">
      <TabsTrigger
        value="income"
        className="rounded-full px-3 py-1.5 text-sm data-active:bg-primary-subtle data-active:text-primary"
      >
        {FINANCES_COPY.export.types.income}
      </TabsTrigger>
      <TabsTrigger
        value="expense"
        className="rounded-full px-3 py-1.5 text-sm data-active:bg-primary-subtle data-active:text-primary"
      >
        {FINANCES_COPY.export.types.expense}
      </TabsTrigger>
    </TabsList>
  );
}
