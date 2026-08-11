"use client";

import { useMemo } from "react";

import {
  buildInventoryColumns,
  getInventoryRowActions,
} from "@/components/inventory/components/list/inventory-columns";
import { DataTable } from "@/components/ui/data-table";
import ListRowActions from "@/components/ui/list-row-actions";
import { INVENTORY_COPY } from "@/copy/inventory-copy";
import { inventoryMobileColumns } from "@/lib/table-mobile-columns";
import type { InventoryItem } from "@/types/database.types";

type InventoryTableProps = {
  items: InventoryItem[];
  emptyMessage?: string;
  onRowClick: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function InventoryTable({
  items,
  emptyMessage,
  onRowClick,
  onEdit,
}: InventoryTableProps) {
  const actionHandlers = useMemo(() => ({ onEdit }), [onEdit]);
  const columns = useMemo(
    () => buildInventoryColumns(actionHandlers),
    [actionHandlers],
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      enablePagination
      enableSorting
      pageSize={10}
      mobileColumns={inventoryMobileColumns}
      renderMobileActions={(item) => (
        <ListRowActions
          actions={getInventoryRowActions(item, actionHandlers)}
          label={INVENTORY_COPY.list.actions.label}
          variant="menu"
        />
      )}
      emptyMessage={emptyMessage ?? "No hay materiales con ese criterio."}
      onRowClick={(item) => onRowClick(item.id)}
    />
  );
}
