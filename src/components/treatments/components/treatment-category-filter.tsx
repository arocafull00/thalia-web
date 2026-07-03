type TreatmentCategoryFilterProps = {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function TreatmentCategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: TreatmentCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((entry) => (
        <button
          key={entry}
          type="button"
          onClick={() => onCategoryChange(entry === "Todos" ? "" : entry)}
          className={`rounded-full px-4 py-2 text-sm ${
            (entry === "Todos" && !activeCategory) || activeCategory === entry
              ? "bg-primary text-on-primary"
              : "bg-surface text-ink-secondary ring-1 ring-border"
          }`}
        >
          {entry}
        </button>
      ))}
    </div>
  );
}
