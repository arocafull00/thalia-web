"use client";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { useInventoryAdjustStockDialog } from "@/lib/hooks/use-inventory-adjust-stock-dialog";

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
      <AppDialogContent>
        <AppDialogHeader>
          <AppDialogTitle>
            {INVENTORY_ITEM_DETAIL_COPY.adjustStock.title}
          </AppDialogTitle>
          <AppDialogDescription>
            {INVENTORY_ITEM_DETAIL_COPY.adjustStock.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {INVENTORY_ITEM_DETAIL_COPY.adjustStock.fields.type}
            </span>
            <select
              {...dialog.register("type")}
              className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="in">
                {INVENTORY_ITEM_DETAIL_COPY.adjustStock.types.in}
              </option>
              <option value="out">
                {INVENTORY_ITEM_DETAIL_COPY.adjustStock.types.out}
              </option>
              <option value="adjustment">
                {INVENTORY_ITEM_DETAIL_COPY.adjustStock.types.adjustment}
              </option>
            </select>
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
      </AppDialogContent>
    </AppDialog>
  );
}
