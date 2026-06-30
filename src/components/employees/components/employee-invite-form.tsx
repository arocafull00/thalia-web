import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import type { EmployeeRole } from "@/types/database.types";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

const roleOptions: EmployeeRole[] = [
  "admin",
  "reception",
  "doctor",
  "auxiliary",
];

type EmployeeInviteFormProps = {
  fullName: string;
  onFullNameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  role: EmployeeRole;
  onRoleChange: (value: EmployeeRole) => void;
  specialty: string;
  onSpecialtyChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
};

export default function EmployeeInviteForm({
  fullName,
  onFullNameChange,
  email,
  onEmailChange,
  role,
  onRoleChange,
  specialty,
  onSpecialtyChange,
  phone,
  onPhoneChange,
}: EmployeeInviteFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {EMPLOYEE_INVITE_COPY.fields.fullName}{" "}
          <span className="text-danger">
            {EMPLOYEE_INVITE_COPY.fields.requiredMark}
          </span>
        </span>
        <input
          value={fullName}
          onChange={(event) => onFullNameChange(event.target.value)}
          className={inputClassName}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {EMPLOYEE_INVITE_COPY.fields.email}{" "}
          <span className="text-danger">
            {EMPLOYEE_INVITE_COPY.fields.requiredMark}
          </span>
        </span>
        <input
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          type="email"
          className={inputClassName}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {EMPLOYEE_INVITE_COPY.fields.role}{" "}
          <span className="text-danger">
            {EMPLOYEE_INVITE_COPY.fields.requiredMark}
          </span>
        </span>
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value as EmployeeRole)}
          className={inputClassName}
        >
          {roleOptions.map((option) => (
            <option key={option} value={option}>
              {EMPLOYEE_INVITE_COPY.roles[option]}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {EMPLOYEE_INVITE_COPY.fields.specialty}
          </span>
          <input
            value={specialty}
            onChange={(event) => onSpecialtyChange(event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {EMPLOYEE_INVITE_COPY.fields.phone}
          </span>
          <input
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            type="tel"
            className={inputClassName}
          />
        </label>
      </div>
    </div>
  );
}
