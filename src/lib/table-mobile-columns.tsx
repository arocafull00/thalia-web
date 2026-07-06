"use client";

import { format } from "date-fns";

import type { MobileCardColumn } from "@/components/ui/mobile-card-view";
import {
  appointmentStatusLabel,
  employeeRoleLabel,
  formatCurrency,
  formatDateTime,
  formatTime,
  transactionTypeLabel,
} from "@/lib/format";
import {
  getInventoryStockLevel,
  inventoryStockLevelLabel,
} from "@/lib/inventory-stock";
import type {
  AppointmentWithRelations,
  Employee,
  InventoryItem,
  Patient,
  Transaction,
} from "@/types/database.types";

function getTreatmentName(appointment: AppointmentWithRelations) {
  return (
    appointment.appointment_treatments[0]?.treatment?.name ?? "Sin tratamiento"
  );
}

export const patientsMobileColumns: MobileCardColumn<Patient>[] = [
  {
    key: "full_name",
    label: "Paciente",
    priority: "primary",
    render: (patient) => (
      <span className="font-medium text-ink">{patient.full_name}</span>
    ),
  },
  {
    key: "phone",
    label: "Telefono",
    priority: "secondary",
    render: (patient) => patient.phone ?? "Sin telefono",
  },
  {
    key: "email",
    label: "Email",
    priority: "secondary",
    render: (patient) => patient.email ?? "-",
  },
];

export const employeesMobileColumns: MobileCardColumn<Employee>[] = [
  {
    key: "full_name",
    label: "Profesional",
    priority: "primary",
    render: (employee) => (
      <span className="font-medium text-ink">{employee.full_name}</span>
    ),
  },
  {
    key: "specialty",
    label: "Especialidad",
    priority: "secondary",
    render: (employee) => employee.specialty ?? "-",
  },
  {
    key: "role",
    label: "Rol",
    priority: "secondary",
    render: (employee) => employeeRoleLabel(employee.role),
  },
  {
    key: "active",
    label: "Estado",
    priority: "secondary",
    render: (employee) => (employee.active === false ? "Inactivo" : "Activo"),
  },
];

export const appointmentsMobileColumns: MobileCardColumn<AppointmentWithRelations>[] =
  [
    {
      key: "patient",
      label: "Paciente",
      priority: "primary",
      render: (appointment) => (
        <span className="font-medium text-ink">
          {appointment.patients?.full_name ?? "Paciente"}
        </span>
      ),
    },
    {
      key: "time",
      label: "Hora",
      priority: "primary",
      render: (appointment) => (
        <span className="font-medium tabular-nums">
          {formatTime(new Date(appointment.starts_at))}
        </span>
      ),
    },
    {
      key: "date",
      label: "Fecha",
      priority: "secondary",
      render: (appointment) =>
        formatDateTime(appointment.starts_at).split(",")[0] ??
        format(new Date(appointment.starts_at), "dd/MM/yyyy"),
    },
    {
      key: "treatment",
      label: "Servicio",
      priority: "secondary",
      render: (appointment) => getTreatmentName(appointment),
    },
    {
      key: "status",
      label: "Estado",
      priority: "secondary",
      render: (appointment) => appointmentStatusLabel(appointment.status),
    },
  ];

export const inventoryMobileColumns: MobileCardColumn<InventoryItem>[] = [
  {
    key: "name",
    label: "Material",
    priority: "primary",
    render: (item) => (
      <span>
        <span className="block font-medium text-ink">{item.name}</span>
        <span className="text-xs text-ink-muted">
          REF: {item.id.slice(0, 8).toUpperCase()}
        </span>
      </span>
    ),
  },
  {
    key: "stock",
    label: "Stock",
    priority: "primary",
    render: (item) => `${Number(item.stock ?? 0)} ${item.unit ?? "un."}`,
  },
  {
    key: "category",
    label: "Categoria",
    priority: "secondary",
    render: (item) => item.category ?? "Sin categoria",
  },
  {
    key: "min_stock",
    label: "Minimo",
    priority: "secondary",
    render: (item) => String(Number(item.min_stock ?? 0)),
  },
  {
    key: "level",
    label: "Estado",
    priority: "secondary",
    render: (item) => {
      const stock = Number(item.stock ?? 0);
      const minStock = Number(item.min_stock ?? 0);
      return inventoryStockLevelLabel(getInventoryStockLevel(stock, minStock));
    },
  },
];

export const transactionsMobileColumns: MobileCardColumn<Transaction>[] = [
  {
    key: "category",
    label: "Categoria",
    priority: "primary",
    render: (transaction) => (
      <span className="font-medium text-ink">
        {transaction.category ?? "Sin categoria"}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Importe",
    priority: "primary",
    render: (transaction) => (
      <span
        className={`font-medium tabular-nums ${
          transaction.type === "income" ? "text-success" : "text-danger"
        }`}
      >
        {transaction.type === "income" ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </span>
    ),
  },
  {
    key: "date",
    label: "Fecha",
    priority: "secondary",
    render: (transaction) => transaction.date ?? "-",
  },
  {
    key: "description",
    label: "Descripcion",
    priority: "secondary",
    render: (transaction) => transaction.description ?? "-",
  },
  {
    key: "type",
    label: "Tipo",
    priority: "secondary",
    render: (transaction) => transactionTypeLabel(transaction.type),
  },
];
