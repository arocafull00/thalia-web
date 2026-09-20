import { Plus, Settings2 } from "lucide-react";

import FinancesCategoryRow from "@/components/finances/components/finances-category-row";
import { Button } from "@/components/ui/button";
import { FINANCES_COPY } from "@/copy/finances-copy";

type CategoryBreakdownItem = {
  categoryId: string | null;
  category: string;
  type: "income" | "expense";
  percent: number;
};

type FinancesCategoryBreakdownProps = {
  items: CategoryBreakdownItem[];
  type: "income" | "expense";
  onTypeChange: (type: "income" | "expense") => void;
  disabled: boolean;
  onCreateCategory: () => void;
  onManageCategories: () => void;
};

export default function FinancesCategoryBreakdown({
  items,
  type,
  onTypeChange,
  disabled,
  onCreateCategory,
  onManageCategories,
}: FinancesCategoryBreakdownProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
        <h3 className="text-lg font-medium text-ink">
          {FINANCES_COPY.categories.title}
        </h3>
        <div className="flex items-center gap-1">
          {/*
            El porcentaje de cada categoría es sobre el total de SU tipo, así
            que el selector no es solo un filtro: es lo que hace que la cifra
            signifique algo. Mezclando ingresos y gastos, una categoría que es
            el 100 % de lo ingresado salía al 75 %.
          */}
          <div
            role="group"
            aria-label={FINANCES_COPY.breakdownType.label}
            className="mr-1 flex items-center gap-0.5 rounded-button bg-primary-subtle p-0.5"
          >
            {(["income", "expense"] as const).map((value) => (
              <Button
                key={value}
                type="button"
                variant="ghost"
                size="xs"
                aria-pressed={type === value}
                data-testid={`finances-breakdown-${value}`}
                onClick={() => onTypeChange(value)}
                className={
                  type === value
                    ? "bg-surface text-primary hover:bg-surface"
                    : "text-ink-muted"
                }
              >
                {FINANCES_COPY.breakdownType[value]}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={disabled}
            onClick={onManageCategories}
            data-testid="finances-categories-manage-trigger"
          >
            <Settings2 aria-hidden="true" />
            {FINANCES_COPY.categories.manage}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="xs"
            disabled={disabled}
            onClick={onCreateCategory}
            data-testid="finances-category-create-trigger"
          >
            <Plus aria-hidden="true" />
            {FINANCES_COPY.categories.new}
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-sm text-ink-secondary">
          {FINANCES_COPY.categories.empty}
        </p>
      ) : (
        <div className="divide-y divide-border-subtle">
          {items.map((item) => (
            <FinancesCategoryRow
              key={item.categoryId ?? `${item.type}:uncategorized`}
              category={item.category}
              percent={item.percent}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
}
