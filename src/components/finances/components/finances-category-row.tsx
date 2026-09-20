type FinancesCategoryRowProps = {
  category: string;
  percent: number;
  type: "income" | "expense";
};

/*
 * La barra toma el color del tipo, el mismo par que usan las cifras del
 * resumen: verde lo que entra, rojo lo que sale. Sin eso, dos desgloses con
 * significados opuestos se leían idénticos y había que mirar el selector para
 * saber cuál se estaba viendo.
 */
const tono = {
  income: { relleno: "bg-primary", pista: "bg-primary-subtle/40" },
  expense: { relleno: "bg-danger", pista: "bg-danger-subtle/40" },
} as const;

export default function FinancesCategoryRow({
  category,
  percent,
  type,
}: FinancesCategoryRowProps) {
  return (
    <div className="space-y-2 py-3">
      <div className="flex items-center justify-between text-sm">
        <span className="truncate text-ink">{category}</span>
        <span className="font-medium tabular-nums text-ink-secondary">
          {percent}%
        </span>
      </div>
      <div className={`h-1 overflow-hidden rounded-full ${tono[type].pista}`}>
        <div
          className={`h-full rounded-full ${tono[type].relleno}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
