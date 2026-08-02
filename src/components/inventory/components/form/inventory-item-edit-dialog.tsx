"use client";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { INVENTORY_ITEM_CREATE_COPY } from "@/copy/inventory-item-create-copy";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { useInventoryItemEditDialog } from "@/lib/hooks/use-inventory-item-edit-dialog";
import type { InventoryItem } from "@/types/database.types";

type InventoryItemEditDialogProps = {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onViewDetail?: () => void;
};

export default function InventoryItemEditDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
  onViewDetail,
}: InventoryItemEditDialogProps) {
  const dialog = useInventoryItemEditDialog(item, () => {
    onOpenChange(false);
    onSuccess();
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  const handleCancel = () => {
    dialog.reset();
    onOpenChange(false);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>Editar material</AppDialogTitle>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1">
          <label className="block space-y-1">
            <span className="text-sm text-ink-secondary">Nombre</span>
            <input
              {...dialog.register("name")}
              className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-ink-secondary">Categoría</span>
            <input
              {...dialog.register("category")}
              className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-ink-secondary">
              {INVENTORY_ITEM_DETAIL_COPY.fields.unit}
            </span>
            <input
              {...dialog.register("unit")}
              placeholder={INVENTORY_ITEM_CREATE_COPY.fields.unitPlaceholder}
              className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
            />
            {dialog.formState.errors.unit ? (
              <span className="text-sm text-danger">
                {dialog.formState.errors.unit.message}
              </span>
            ) : null}
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="space-y-1">
              <span className="text-sm text-ink-secondary">Stock</span>
              <input
                type="number"
                {...dialog.register("stock")}
                className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-ink-secondary">Stock mínimo</span>
              <input
                type="number"
                {...dialog.register("min_stock")}
                className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-ink-secondary">Precio</span>
              <input
                type="number"
                step="0.01"
                {...dialog.register("unit_price")}
                className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>
        <AppDialogFooter errorMessage={dialog.formState.errors.root?.message}>
          {onViewDetail ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onViewDetail}
              className="mr-auto rounded-button px-3 py-1.5 text-sm"
            >
              <FORM_ACTION_ICONS.viewDetail
                className={FORM_ACTION_ICON_CLASS}
                aria-hidden="true"
              />
              {INVENTORY_ITEM_DETAIL_COPY.actions.viewDetail}
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={handleCancel}>
            <FORM_ACTION_ICONS.cancel
              className={FORM_ACTION_ICON_CLASS}
              aria-hidden="true"
            />
            {INVENTORY_ITEM_CREATE_COPY.actions.cancel}
          </Button>
          <ActionButton
            icon={FORM_ACTION_ICONS.save}
            title={
              dialog.isPending
                ? INVENTORY_ITEM_CREATE_COPY.actions.saving
                : INVENTORY_ITEM_CREATE_COPY.actions.save
            }
            disabled={dialog.isPending}
            testId="inventory-edit-submit"
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
