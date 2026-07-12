import { Button } from "@/components/ui/button";
import { LOGIN_COPY } from "@/copy/login-copy";

type LoginAuthTabsProps = {
  onRegisterPress: () => void;
};

export default function LoginAuthTabs({ onRegisterPress }: LoginAuthTabsProps) {
  return (
    <div className="flex rounded-xl bg-canvas p-1">
      <Button
        type="button"
        variant="outline"
        className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm"
      >
        {LOGIN_COPY.tabs.signIn}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onRegisterPress}
        className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium"
      >
        {LOGIN_COPY.tabs.register}
      </Button>
    </div>
  );
}
