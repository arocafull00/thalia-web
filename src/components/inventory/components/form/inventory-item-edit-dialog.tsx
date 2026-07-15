"use client";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { useInventoryItemEditDialog } from "@/lib/hooks/use-inventory-item-edit-dialog";
import type { InventoryItem } from "@/types/database.types";

type InventoryItemEditDialogProps = {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function InventoryItemEditDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: InventoryItemEditDialogProps) {
  const dialog = useInventoryItemEditDialog(item, () => {
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
            <span className="text-sm text-ink-secondary">Unidad</span>
            <input
              {...dialog.register("unit")}
              className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
            />
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
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <ActionButton
            title={dialog.isPending ? "Guardando..." : "Guardar"}
            disabled={dialog.isPending}
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
