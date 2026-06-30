import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCreateEmployee } from "@/lib/hooks/use-employees";
import type { EmployeeRole } from "@/types/database.types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useEmployeeInviteDialog(onSuccess: () => void) {
  const clinicId = useClinicId();
  const { mutate, isPending } = useCreateEmployee();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<EmployeeRole>("doctor");
  const [specialty, setSpecialty] = useState("");
  const [phone, setPhone] = useState("");

  const reset = useCallback(() => {
    setFullName("");
    setEmail("");
    setRole("doctor");
    setSpecialty("");
    setPhone("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (!fullName.trim()) {
      toast.error(EMPLOYEE_INVITE_COPY.validation.fullNameRequired);
      return;
    }

    if (!email.trim()) {
      toast.error(EMPLOYEE_INVITE_COPY.validation.emailRequired);
      return;
    }

    if (!emailPattern.test(email.trim())) {
      toast.error(EMPLOYEE_INVITE_COPY.validation.emailInvalid);
      return;
    }

    if (!clinicId) {
      toast.error(EMPLOYEE_INVITE_COPY.validation.clinicRequired);
      return;
    }

    mutate(
      {
        clinicId,
        email: email.trim(),
        fullName: fullName.trim(),
        role,
        specialty: specialty.trim() || null,
        color: null,
        phone: phone.trim() || null,
      },
      {
        onSuccess: () => {
          toast.success(EMPLOYEE_INVITE_COPY.success);
          reset();
          onSuccess();
        },
        onError: (cause) => {
          toast.error(cause.message || EMPLOYEE_INVITE_COPY.error);
        },
      },
    );
  }, [
    clinicId,
    email,
    fullName,
    mutate,
    onSuccess,
    phone,
    reset,
    role,
    specialty,
  ]);

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    role,
    setRole,
    specialty,
    setSpecialty,
    phone,
    setPhone,
    isPending,
    reset,
    handleSubmit,
  };
}
