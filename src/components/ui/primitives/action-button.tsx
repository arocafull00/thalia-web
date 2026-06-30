"use client";

export function ActionButton({
  title,
  onClick,
  disabled,
  variant = "solid",
}: {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
}) {
  if (variant === "ghost") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas disabled:opacity-50"
      >
        {title}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wide text-on-primary hover:bg-primary-hover disabled:opacity-50"
    >
      {title}
    </button>
  );
}
