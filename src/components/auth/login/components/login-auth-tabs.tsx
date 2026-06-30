import { LOGIN_COPY } from "@/copy/login-copy";

type LoginAuthTabsProps = {
  onRegisterPress: () => void;
};

export default function LoginAuthTabs({ onRegisterPress }: LoginAuthTabsProps) {
  return (
    <div className="flex rounded-xl bg-canvas p-1">
      <button
        type="button"
        className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-sm"
      >
        {LOGIN_COPY.tabs.signIn}
      </button>
      <button
        type="button"
        onClick={onRegisterPress}
        className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-ink-secondary hover:text-ink"
      >
        {LOGIN_COPY.tabs.register}
      </button>
    </div>
  );
}
