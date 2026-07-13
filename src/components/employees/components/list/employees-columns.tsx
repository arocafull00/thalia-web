"use client";

import type { ColumnDef } from "@tanstack/react-table";

import SortableTableHead from "@/components/ui/sortable-table-head";
import { employeeRoleLabel } from "@/lib/format";
import type { Employee } from "@/types/database.types";

export const employeesColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Profesional" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium text-ink">
        {row.getValue("full_name")}
      </span>
    ),
  },
  {
    accessorKey: "specialty",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Especialidad" />
    ),
    cell: ({ row }) => (
      <span className="truncate text-sm text-ink-secondary">
        {row.getValue("specialty") ?? "-"}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftSpecialty = (left.original.specialty ?? "").toLowerCase();
      const rightSpecialty = (right.original.specialty ?? "").toLowerCase();
      return leftSpecialty.localeCompare(rightSpecialty, "es");
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <SortableTableHead column={column} title="Rol" />,
    cell: ({ row }) => (
      <span className="text-xs uppercase tracking-wide text-ink-secondary">
        {employeeRoleLabel(row.original.role)}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftRole = employeeRoleLabel(left.original.role);
      const rightRole = employeeRoleLabel(right.original.role);
      return leftRole.localeCompare(rightRole, "es");
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <span
        className={`text-xs uppercase tracking-wide ${
          row.original.active === false ? "text-danger" : "text-success"
        }`}
      >
        {row.original.active === false ? "Inactivo" : "Activo"}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftActive = left.original.active !== false;
      const rightActive = right.original.active !== false;
      return Number(rightActive) - Number(leftActive);
    },
  },
];
