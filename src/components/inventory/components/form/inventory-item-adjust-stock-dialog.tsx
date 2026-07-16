"use client";

import { Controller } from "react-hook-form";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { useInventoryAdjustStockDialog } from "@/lib/hooks/use-inventory-adjust-stock-dialog";

const movementTypeOptions = [
  {
    value: "in",
    label: INVENTORY_ITEM_DETAIL_COPY.adjustStock.types.in,
  },
  {
    value: "out",
    label: INVENTORY_ITEM_DETAIL_COPY.adjustStock.types.out,
  },
  {
    value: "adjustment",
    label: INVENTORY_ITEM_DETAIL_COPY.adjustStock.types.adjustment,
  },
];

type InventoryItemAdjustStockDialogProps = {
  itemId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function InventoryItemAdjustStockDialog({
  itemId,
  open,
  onOpenChange,
  onSuccess,
}: InventoryItemAdjustStockDialogProps) {
  const dialog = useInventoryAdjustStockDialog(itemId, () => {
    onOpenChange(false);
    onSuccess();
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>
            {INVENTORY_ITEM_DETAIL_COPY.adjustStock.title}
          </AppDialogTitle>
          <AppDialogDescription>
            {INVENTORY_ITEM_DETAIL_COPY.adjustStock.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {INVENTORY_ITEM_DETAIL_COPY.adjustStock.fields.type}
            </span>
            <Controller
              name="type"
              control={dialog.control}
              render={({ field }) => (
                <AppSearchableCombobox
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "in")}
                  options={movementTypeOptions}
                  placeholder={
                    INVENTORY_ITEM_DETAIL_COPY.adjustStock.fields.type
                  }
                  showSearch={false}
                />
              )}
            />
            {dialog.errors.type ? (
              <p className="text-sm text-danger">
                {dialog.errors.type.message}
              </p>
            ) : null}
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {INVENTORY_ITEM_DETAIL_COPY.adjustStock.fields.quantity}
            </span>
            <input
              type="number"
              min="1"
              step="1"
              {...dialog.register("quantity")}
              className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary"
            />
            {dialog.errors.quantity ? (
              <p className="text-sm text-danger">
                {dialog.errors.quantity.message}
              </p>
            ) : null}
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {INVENTORY_ITEM_DETAIL_COPY.adjustStock.fields.notes}
            </span>
            <textarea
              rows={3}
              {...dialog.register("notes")}
              className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary"
            />
            {dialog.errors.notes ? (
              <p className="text-sm text-danger">
                {dialog.errors.notes.message}
              </p>
            ) : null}
          </label>
        </div>
        <AppDialogFooter errorMessage={dialog.errors.root?.message}>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            {INVENTORY_ITEM_DETAIL_COPY.adjustStock.actions.cancel}
          </Button>
          <ActionButton
            title={
              dialog.isPending
                ? INVENTORY_ITEM_DETAIL_COPY.adjustStock.actions.saving
                : INVENTORY_ITEM_DETAIL_COPY.adjustStock.actions.save
            }
            disabled={dialog.isPending}
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
