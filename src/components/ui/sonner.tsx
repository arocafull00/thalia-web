"use client";

import type { CSSProperties } from "react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const toasterStyle = {
  "--normal-bg": "var(--surface)",
  "--normal-text": "var(--ink)",
  "--normal-border": "var(--border-strong)",
  "--border-radius": "var(--radius-dialog)",
  "--success-bg": "var(--success)",
  "--success-border":
    "color-mix(in srgb, var(--success-text) 22%, var(--success))",
  "--success-text": "var(--success-text)",
  "--info-bg": "var(--primary-subtle)",
  "--info-border":
    "color-mix(in srgb, var(--primary) 22%, var(--primary-subtle))",
  "--info-text": "var(--primary-hover)",
  "--warning-bg": "var(--warning)",
  "--warning-border":
    "color-mix(in srgb, var(--warning-text) 22%, var(--warning))",
  "--warning-text": "var(--warning-text)",
  "--error-bg": "var(--danger)",
  "--error-border": "color-mix(in srgb, var(--danger-text) 22%, var(--danger))",
  "--error-text": "var(--danger-text)",
} as CSSProperties;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={toasterStyle}
      toastOptions={{
        classNames: {
          toast:
            "cn-toast !font-sans !text-sm !shadow-panel group-[.toaster]:border-border-strong",
          title: "font-medium",
          description: "text-ink-secondary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
