import type { LucideIcon } from "lucide-react";

export type ProfileAction = {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "danger";
  buttonVariant?: "solid" | "ghost";
  disabled?: boolean;
  testId?: string;
};

export type ProfileActionSection = {
  label: string;
  actions: ProfileAction[];
};
