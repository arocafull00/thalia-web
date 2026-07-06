"use client";

import { employeesColumns } from "@/components/employees/components/employees-columns";
import { DataTable } from "@/components/ui/data-table";
import { employeesMobileColumns } from "@/lib/table-mobile-columns";
import type { Employee } from "@/types/database.types";

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
