import type { ReactNode } from "react";

import LoginAuthTabs from "@/components/auth/login/components/login-auth-tabs";
import { useLoginRegisterSlider } from "@/components/auth/login/hooks/use-login-register-slider";
import { cn } from "@/lib/utils";

type LoginRegisterSliderProps = {
  loginContent: ReactNode;
  registerContent: ReactNode;
};

export default function LoginRegisterSlider({
  loginContent,
  registerContent,
}: LoginRegisterSliderProps) {
  const {
    handleTabKeyDown,
    height,
    loginPanelRef,
    loginTabId,
    mode,
    registerPanelRef,
    registerTabId,
    selectMode,
  } = useLoginRegisterSlider();

  return (
    <div className="w-full">
      <LoginAuthTabs
        loginTabId={loginTabId}
        mode={mode}
        onKeyDown={handleTabKeyDown}
        onSelect={selectMode}
        registerTabId={registerTabId}
      />
      <div
        className="mt-6 overflow-hidden transition-[height] duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] motion-reduce:transition-none"
        style={height > 0 ? { height } : undefined}
      >
        <div
          className={cn(
            "flex w-[200%] items-start transition-transform duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] motion-reduce:transition-none",
            mode === "register" && "-translate-x-1/2",
          )}
        >
          <div
            ref={loginPanelRef}
            id="login-panel"
            role="tabpanel"
            aria-labelledby={loginTabId}
            aria-hidden={mode !== "login"}
            inert={mode !== "login"}
            className="flex w-1/2 shrink-0 justify-center px-0.5"
          >
            {loginContent}
          </div>
          <div
            ref={registerPanelRef}
            id="register-panel"
            role="tabpanel"
            aria-labelledby={registerTabId}
            aria-hidden={mode !== "register"}
            inert={mode !== "register"}
            className="flex w-1/2 shrink-0 justify-center px-0.5"
          >
            {registerContent}
          </div>
        </div>
      </div>
    </div>
  );
}
