import { ArrowLeft, Eye, Save, Upload, X, type LucideIcon } from "lucide-react";

export const FORM_ACTION_ICONS = {
  cancel: X,
  save: Save,
  viewDetail: Eye,
  back: ArrowLeft,
  upload: Upload,
} as const satisfies Record<string, LucideIcon>;

export const FORM_ACTION_ICON_CLASS = "size-3.5 shrink-0";
