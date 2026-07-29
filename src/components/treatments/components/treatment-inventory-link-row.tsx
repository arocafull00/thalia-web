import { Package, Trash2 } from "lucide-react";
import Link from "next/link";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

import type { TreatmentFormValues } from "@/components/treatments/hooks/use-treatment-dialog";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type InventoryOption = {
  value: string;
  label: string;
};

type TreatmentInventoryLinkRowFormProps = {
  variant?: "form";
  index: number;
  control: Control<TreatmentFormValues>;
  errors: FieldErrors<TreatmentFormValues>;
  inventoryOptions: InventoryOption[];
  selectedIds: string[];
  loading: boolean;
  onRemove: () => void;
};

type TreatmentInventoryLinkRowDisplayProps = {
  variant: "display";
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string | null;
};

type TreatmentInventoryLinkRowProps =
  TreatmentInventoryLinkRowFormProps | TreatmentInventoryLinkRowDisplayProps;

function formatQuantity(quantity: number, unit: string | null) {
  if (!unit) {
    return String(quantity);
  }

  return `${quantity} ${unit}`;
}

export default function TreatmentInventoryLinkRow(
  props: TreatmentInventoryLinkRowProps,
) {
  if (props.variant === "display") {
    return (
      <Link
        href={`/inventory/${props.inventoryItemId}`}
        className="flex items-center justify-between gap-4 border-b border-border-subtle py-3 text-sm transition-colors last:border-b-0 hover:bg-(--hover-overlay)"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Package
            className="size-4 shrink-0 text-ink-muted"
            aria-hidden="true"
          />
          <span className="truncate text-ink">{props.name}</span>
        </div>
        <span className="shrink-0 text-ink-secondary">
          {formatQuantity(props.quantity, props.unit)}
        </span>
      </Link>
    );
  }

  const {
    index,
    control,
    errors,
    inventoryOptions,
    selectedIds,
    loading,
    onRemove,
  } = props;

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className="py-3 whitespace-normal">
        <Controller
          name={`inventoryLinks.${index}.inventory_item_id`}
          control={control}
          render={({ field: controllerField }) => (
            <AppSearchableCombobox
              value={controllerField.value || null}
              onValueChange={(value) => controllerField.onChange(value ?? "")}
              options={inventoryOptions.filter(
                (option) =>
                  option.value === controllerField.value ||
                  !selectedIds.includes(option.value),
              )}
              placeholder={TREATMENTS_COPY.form.selectMaterial}
              searchPlaceholder={TREATMENTS_COPY.form.searchMaterial}
              loading={loading}
            />
          )}
        />
        {errors.inventoryLinks?.[index]?.inventory_item_id ? (
          <span className="mt-1 block text-sm text-danger">
            {errors.inventoryLinks[index]?.inventory_item_id?.message}
          </span>
        ) : null}
      </TableCell>
      <TableCell className="w-[160px] px-4 py-3">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <Controller
              name={`inventoryLinks.${index}.quantity`}
              control={control}
              render={({ field: controllerField }) => {
                const quantityValue =
                  typeof controllerField.value === "number" ||
                  typeof controllerField.value === "string"
                    ? controllerField.value
                    : "";

                return (
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={quantityValue}
                    onChange={(event) =>
                      controllerField.onChange(event.target.value)
                    }
                    className={inputClassName}
                  />
                );
              }}
            />
            {errors.inventoryLinks?.[index]?.quantity ? (
              <span className="mt-1 block text-sm text-danger">
                {errors.inventoryLinks[index]?.quantity?.message}
              </span>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={TREATMENTS_COPY.form.removeMaterial}
            className="mt-0.5 shrink-0 rounded-full hover:text-danger"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
