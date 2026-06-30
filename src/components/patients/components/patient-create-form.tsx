import NewPatientDateField from "@/components/patients/new-patient-date-field";
import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type PatientCreateFormProps = {
  fullName: string;
  onFullNameChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  dni: string;
  onDniChange: (value: string) => void;
  birthDate: Date | null;
  onBirthDateChange: (value: Date) => void;
  address: string;
  onAddressChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
};

export default function PatientCreateForm({
  fullName,
  onFullNameChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  dni,
  onDniChange,
  birthDate,
  onBirthDateChange,
  address,
  onAddressChange,
  notes,
  onNotesChange,
}: PatientCreateFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_CREATE_COPY.fields.fullName}{" "}
          <span className="text-danger">
            {PATIENT_CREATE_COPY.fields.requiredMark}
          </span>
        </span>
        <input
          value={fullName}
          onChange={(event) => onFullNameChange(event.target.value)}
          className={inputClassName}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_CREATE_COPY.fields.phone}
          </span>
          <input
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            type="tel"
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_CREATE_COPY.fields.email}
          </span>
          <input
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            type="email"
            className={inputClassName}
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_CREATE_COPY.fields.dni}
          </span>
          <input
            value={dni}
            onChange={(event) => onDniChange(event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_CREATE_COPY.fields.birthDate}
          </span>
          <NewPatientDateField value={birthDate} onChange={onBirthDateChange} />
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_CREATE_COPY.fields.address}
        </span>
        <input
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
          className={inputClassName}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_CREATE_COPY.fields.notes}
        </span>
        <textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          rows={3}
          className={inputClassName}
        />
      </label>
    </div>
  );
}
