import type { KeyboardEvent } from "react";

import type { AuthMode } from "@/components/auth/login/hooks/use-login-register-slider";
import { Button } from "@/components/ui/button";
import { LOGIN_COPY } from "@/copy/login-copy";
import { cn } from "@/lib/utils";

type LoginAuthTabsProps = {
  loginTabId: string;
  mode: AuthMode;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onSelect: (mode: AuthMode) => void;
  registerTabId: string;
};

export default function LoginAuthTabs({
  loginTabId,
  mode,
  onKeyDown,
  onSelect,
  registerTabId,
}: LoginAuthTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Elige cómo acceder"
      className="relative grid grid-cols-2 rounded-xl bg-canvas p-1"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg border border-border bg-surface shadow-sm transition-transform duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] motion-reduce:transition-none",
          mode === "register" && "translate-x-full",
        )}
      />
      <Button
        id={loginTabId}
        type="button"
        role="tab"
        variant="ghost"
        aria-controls="login-panel"
        aria-selected={mode === "login"}
        tabIndex={mode === "login" ? 0 : -1}
        onClick={() => onSelect("login")}
        onKeyDown={onKeyDown}
        className="relative z-1 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-transparent"
      >
        {LOGIN_COPY.tabs.signIn}
      </Button>
      <Button
        id={registerTabId}
        type="button"
        role="tab"
        variant="ghost"
        aria-controls="register-panel"
        aria-selected={mode === "register"}
        tabIndex={mode === "register" ? 0 : -1}
        onClick={() => onSelect("register")}
        onKeyDown={onKeyDown}
        className="relative z-1 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-transparent"
      >
        {LOGIN_COPY.tabs.register}
      </Button>
    </div>
  );
}
