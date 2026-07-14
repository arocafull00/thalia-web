import TreatmentInventoryLinkRow from "@/components/treatments/components/treatment-inventory-link-row";
import { TREATMENT_DETAIL_COPY } from "@/copy/treatment-detail-copy";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentDetailInventorySectionProps = {
  treatment: TreatmentWithInventory;
};

export default function TreatmentDetailInventorySection({
  treatment,
}: TreatmentDetailInventorySectionProps) {
  const items = treatment.treatment_inventory_items;

  return (
    <section aria-label={TREATMENT_DETAIL_COPY.sections.materials}>
      <h2 className="border-b border-border-subtle pb-4 text-sm font-medium text-ink">
        {TREATMENT_DETAIL_COPY.sections.materials}
      </h2>
      <p className="mt-4 text-sm text-ink-secondary">
        {TREATMENT_DETAIL_COPY.materials.hint}
      </p>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-secondary">
          {TREATMENT_DETAIL_COPY.materials.empty}
        </p>
      ) : (
        <div className="mt-4">
          {items.map((item) => (
            <TreatmentInventoryLinkRow
              key={item.inventory_item_id}
              variant="display"
              inventoryItemId={item.inventory_item_id}
              name={item.inventory_items?.name ?? "Material"}
              quantity={item.quantity}
              unit={item.inventory_items?.unit ?? null}
            />
          ))}
        </div>
      )}
    </section>
  );
}
