import type { LucideIcon } from "lucide-react";
import { create } from "zustand";

import type { ProfileAction } from "@/components/ui/profile/profile-action";

export type TopbarBreadcrumb = {
  rootLabel: string;
  rootHref: string;
  currentLabel: string;
};

export type TopbarAction = {
  title: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
  desktopOnly?: boolean;
};

export type TopbarMenu = {
  actions: ProfileAction[];
  ariaLabel: string;
};

type TopbarActionStore = {
  action: TopbarAction | null;
  breadcrumb: TopbarBreadcrumb | null;
  actions: TopbarAction[];
  menu: TopbarMenu | null;
  setAction: (action: TopbarAction | null) => void;
  setBreadcrumb: (breadcrumb: TopbarBreadcrumb | null) => void;
  setActions: (actions: TopbarAction[]) => void;
  setMenu: (menu: TopbarMenu | null) => void;
};

export const useTopbarActionStore = create<TopbarActionStore>((set) => ({
  action: null,
  breadcrumb: null,
  actions: [],
  menu: null,
  setAction: (action) => set({ action }),
  setBreadcrumb: (breadcrumb) => set({ breadcrumb }),
  setActions: (actions) => set({ actions }),
  setMenu: (menu) => set({ menu }),
}));
