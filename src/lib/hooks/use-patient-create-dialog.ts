import { format } from "date-fns";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCreatePatient } from "@/lib/hooks/use-patients";

export function usePatientCreateDialog(onSuccess: () => void) {
  const clinicId = useClinicId();
  const { mutateAsync, isPending } = useCreatePatient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const reset = useCallback(() => {
    setFullName("");
    setPhone("");
    setEmail("");
    setDni("");
    setBirthDate(null);
    setAddress("");
    setNotes("");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!fullName.trim()) {
      toast.error(PATIENT_CREATE_COPY.validation.fullNameRequired);
      return;
    }

    if (!clinicId) {
      toast.error(PATIENT_CREATE_COPY.validation.clinicRequired);
      return;
    }

    try {
      await mutateAsync({
        clinic_id: clinicId,
        full_name: fullName.trim(),
        dni: dni.trim() || null,
        birth_date: birthDate ? format(birthDate, "yyyy-MM-dd") : null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
        notes: notes.trim() || null,
      });
      toast.success(PATIENT_CREATE_COPY.success);
      reset();
      onSuccess();
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : PATIENT_CREATE_COPY.error,
      );
    }
  }, [
    address,
    birthDate,
    clinicId,
    dni,
    email,
    fullName,
    mutateAsync,
    notes,
    onSuccess,
    phone,
    reset,
  ]);

  return {
    fullName,
    setFullName,
    phone,
    setPhone,
    email,
    setEmail,
    dni,
    setDni,
    birthDate,
    setBirthDate,
    address,
    setAddress,
    notes,
    setNotes,
    isPending,
    reset,
    handleSubmit,
  };
}
