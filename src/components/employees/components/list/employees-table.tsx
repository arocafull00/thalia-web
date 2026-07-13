"use client";

import { DataTable } from "@/components/ui/data-table";
import { employeesMobileColumns } from "@/lib/table-mobile-columns";
import type { Employee } from "@/types/database.types";

import { employeesColumns } from "./employees-columns";

type EmployeesTableProps = {
  employees: Employee[];
  onRowClick: (id: string) => void;
};

export default function EmployeesTable({
  employees,
  onRowClick,
}: EmployeesTableProps) {
  return (
    <DataTable
      columns={employeesColumns}
      data={employees}
      enableSorting
      mobileColumns={employeesMobileColumns}
      onRowClick={(employee) => onRowClick(employee.id)}
    />
  );
}
