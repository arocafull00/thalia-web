import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { LOGIN_COPY } from "@/components/auth/login/login-copy";

type LoginFormFieldsProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  password: string;
  showPassword: boolean;
};

export default function LoginFormFields({
  email,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  password,
  showPassword,
}: LoginFormFieldsProps) {
  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {LOGIN_COPY.fields.emailLabel}{" "}
          <span className="text-danger">{LOGIN_COPY.fields.requiredMark}</span>
        </span>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            type="email"
            autoComplete="email"
            placeholder={LOGIN_COPY.fields.emailPlaceholder}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pr-3 pl-10 text-sm outline-none ring-primary focus:ring-2"
          />
        </div>
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {LOGIN_COPY.fields.passwordLabel}{" "}
          <span className="text-danger">{LOGIN_COPY.fields.requiredMark}</span>
        </span>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder={LOGIN_COPY.fields.passwordPlaceholder}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pr-10 pl-10 text-sm outline-none ring-primary focus:ring-2"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted hover:text-ink-secondary"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>
    </div>
  );
}
