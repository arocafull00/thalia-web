"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, UserCheck, UserX } from "lucide-react";

import ListRowActions from "@/components/ui/list-row-actions";
import type { ProfileAction } from "@/components/ui/profile/profile-action";
import SortableTableHead from "@/components/ui/sortable-table-head";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import { employeeRoleLabel } from "@/lib/format";
import type { Employee } from "@/types/database.types";

export type EmployeeListActionHandlers = {
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
};

export function getEmployeeRowActions(
  employee: Employee,
  handlers: EmployeeListActionHandlers,
): ProfileAction[] {
  const isInactive = employee.active === false;

  return [
    {
      label: EMPLOYEES_COPY.list.actions.view,
      icon: Eye,
      href: `/employees/${employee.id}`,
    },
    {
      label: EMPLOYEES_COPY.list.actions.edit,
      icon: Pencil,
      onClick: () => handlers.onEdit(employee.id),
    },
    {
      label: isInactive
        ? EMPLOYEES_COPY.list.actions.activate
        : EMPLOYEES_COPY.list.actions.deactivate,
      icon: isInactive ? UserCheck : UserX,
      onClick: () => handlers.onToggleStatus(employee.id),
      variant: isInactive ? "default" : "danger",
    },
  ];
}

export function buildEmployeesColumns(
  handlers: EmployeeListActionHandlers,
): ColumnDef<Employee>[] {
  return [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <SortableTableHead column={column} title="Profesional" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span
            className={`inline-block size-3.5 shrink-0 rounded-full border border-border ${row.original.color ? "" : "bg-border"}`}
            style={
              row.original.color
                ? { backgroundColor: row.original.color }
                : undefined
            }
            aria-hidden="true"
          />
          <span className="truncate font-medium text-ink">
            {row.getValue("full_name")}
          </span>
        </div>
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
    {
      id: "actions",
      header: () => EMPLOYEES_COPY.list.columns.actions,
      cell: ({ row }) => (
        <ListRowActions
          actions={getEmployeeRowActions(row.original, handlers)}
          label={EMPLOYEES_COPY.list.actions.label}
        />
      ),
      enableSorting: false,
    },
  ];
}
