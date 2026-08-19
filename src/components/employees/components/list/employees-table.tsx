"use client";

import { useMemo } from "react";

import {
  buildEmployeesColumns,
  getEmployeeRowActions,
} from "@/components/employees/components/list/employees-columns";
import { DataTable } from "@/components/ui/data-table";
import ListRowActions from "@/components/ui/list-row-actions";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import { employeesMobileColumns } from "@/lib/table-mobile-columns";
import type { Employee } from "@/types/database.types";

type EmployeesTableProps = {
  employees: Employee[];
  onRowClick: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  /** Paginación en servidor: `employees` es ya la página visible. */
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
  };
};

export default function EmployeesTable({
  employees,
  onRowClick,
  onEdit,
  onToggleStatus,
  pagination,
}: EmployeesTableProps) {
  const actionHandlers = useMemo(
    () => ({ onEdit, onToggleStatus }),
    [onEdit, onToggleStatus],
  );
  const columns = useMemo(
    () => buildEmployeesColumns(actionHandlers),
    [actionHandlers],
  );

  return (
    <DataTable
      columns={columns}
      data={employees}
      manualPagination={pagination}
      mobileColumns={employeesMobileColumns}
      renderMobileActions={(employee) => (
        <ListRowActions
          actions={getEmployeeRowActions(employee, actionHandlers)}
          label={EMPLOYEES_COPY.list.actions.label}
          variant="menu"
        />
      )}
      onRowClick={(employee) => onRowClick(employee.id)}
    />
  );
}
