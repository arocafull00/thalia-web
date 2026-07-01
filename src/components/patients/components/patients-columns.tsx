"use client";

import type { ColumnDef } from "@tanstack/react-table";

import SortableTableHead from "@/components/ui/sortable-table-head";
import type { Patient } from "@/types/database.types";

export const patientsColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Paciente" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium text-ink">
        {row.getValue("full_name")}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Telefono" />
    ),
    cell: ({ row }) => (
      <span className="truncate text-sm text-ink-secondary">
        {row.getValue("phone") ?? "Sin telefono"}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftPhone = (left.original.phone ?? "").toLowerCase();
      const rightPhone = (right.original.phone ?? "").toLowerCase();
      return leftPhone.localeCompare(rightPhone, "es");
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableTableHead column={column} title="Email" />,
    cell: ({ row }) => (
      <span className="truncate text-sm text-ink-secondary">
        {row.getValue("email") ?? "-"}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftEmail = (left.original.email ?? "").toLowerCase();
      const rightEmail = (right.original.email ?? "").toLowerCase();
      return leftEmail.localeCompare(rightEmail, "es");
    },
  },
];
