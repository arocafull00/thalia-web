"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import type { ComponentProps } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type PasswordInputProps = Omit<ComponentProps<"input">, "type"> & {
  visible: boolean;
  onToggleVisibility: () => void;
};

export default function PasswordInput({
  visible,
  onToggleVisibility,
  ...props
}: PasswordInputProps) {
  const visibilityLabel = visible ? "Ocultar contraseña" : "Mostrar contraseña";

  return (
    <InputGroup className="h-10 rounded-xl border-border/60 bg-surface">
      <InputGroupAddon>
        <Lock aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput type={visible ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-sm"
          onClick={onToggleVisibility}
          aria-label={visibilityLabel}
          title={visibilityLabel}
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
