import { Plus } from "lucide-react";
import { useFieldArray, type Control, type FieldErrors } from "react-hook-form";

import TreatmentInventoryLinkRow from "@/components/treatments/components/treatment-inventory-link-row";
import type { TreatmentFormValues } from "@/components/treatments/hooks/use-treatment-dialog";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInventoryItems } from "@/lib/hooks/use-inventory";

type TreatmentInventoryLinksFieldProps = {
  control: Control<TreatmentFormValues>;
  errors: FieldErrors<TreatmentFormValues>;
};

export default function TreatmentInventoryLinksField({
  control,
  errors,
}: TreatmentInventoryLinksFieldProps) {
  const inventory = useInventoryItems();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventoryLinks",
  });

  const inventoryOptions = (inventory.data ?? []).map((item) => ({
    value: item.id,
    label: item.unit ? `${item.name} (${item.unit})` : item.name,
  }));

  const selectedIds = fields.map(
    (field) => (field as { inventory_item_id: string }).inventory_item_id,
  );

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm text-ink-secondary">
        {TREATMENTS_COPY.form.materials}
      </legend>
      <p className="text-sm text-ink-muted">
        {TREATMENTS_COPY.form.materialsHint}
      </p>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 pb-3 pt-1">
              {TREATMENTS_COPY.form.material}
            </TableHead>
            <TableHead className="w-[120px] px-4 pb-3 pt-1">
              {TREATMENTS_COPY.form.quantity}
            </TableHead>
            <TableHead className="w-12 px-4 pb-3 pt-1" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={3}
                className="py-6 text-center text-ink-secondary"
              >
                {TREATMENTS_COPY.row.noMaterials}
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => (
              <TreatmentInventoryLinkRow
                key={field.id}
                index={index}
                control={control}
                errors={errors}
                inventoryOptions={inventoryOptions}
                selectedIds={selectedIds}
                loading={inventory.isLoading}
                onRemove={() => remove(index)}
              />
            ))
          )}
        </TableBody>
      </Table>
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ inventory_item_id: "", quantity: 1 })}
        className="rounded-button px-3 py-1.5 text-sm"
      >
        <Plus className="size-3.5" aria-hidden="true" />
        {TREATMENTS_COPY.form.addMaterial}
      </Button>
    </fieldset>
  );
}
