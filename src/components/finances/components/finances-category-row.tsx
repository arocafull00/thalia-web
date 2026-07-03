type FinancesCategoryRowProps = {
  category: string;
  percent: number;
};

export default function FinancesCategoryRow({
  category,
  percent,
}: FinancesCategoryRowProps) {
  return (
    <div className="space-y-2 py-3">
      <div className="flex items-center justify-between text-sm">
        <span className="truncate text-ink">{category}</span>
        <span className="font-medium tabular-nums text-ink-secondary">
          {percent}%
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-primary-subtle/40">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
