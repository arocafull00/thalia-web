import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SettingsDetailTabButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export default function SettingsDetailTabButton({
  label,
  isActive,
  onClick,
}: SettingsDetailTabButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        "relative shrink-0 rounded-none px-4 py-3 text-[0.8rem] font-medium whitespace-nowrap",
        isActive
          ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-primary"
          : "text-ink-muted hover:text-ink-secondary",
      )}
    >
      {label}
    </Button>
  );
}
