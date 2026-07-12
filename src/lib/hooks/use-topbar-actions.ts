import { useEffect, useEffectEvent } from "react";

import type { ProfileAction } from "@/components/ui/profile/profile-action";
import type { TopbarAction } from "@/stores/topbar-action-store";
import { useTopbarActionStore } from "@/stores/topbar-action-store";

export type TopbarActionButtonConfig = Omit<TopbarAction, "onClick"> & {
  onClick: () => void;
};

export type TopbarActionsConfig = {
  buttons: TopbarActionButtonConfig[];
  menu: {
    actions: ProfileAction[];
    ariaLabel: string;
  };
};

export function useTopbarActions(config: TopbarActionsConfig | null) {
  const setActions = useTopbarActionStore((state) => state.setActions);
  const setMenu = useTopbarActionStore((state) => state.setMenu);
  const buttonsKey =
    config?.buttons
      .map(
        (button) =>
          `${button.title}:${button.variant ?? "solid"}:${button.desktopOnly ?? false}`,
      )
      .join("|") ?? "";
  const menuKey =
    config?.menu.actions.map((action) => action.label).join("|") ?? "";
  const menuAriaLabel = config?.menu.ariaLabel;

  const handleButtonClick = useEffectEvent((index: number) => {
    config?.buttons[index]?.onClick();
  });

  const handleMenuClick = useEffectEvent((index: number) => {
    config?.menu.actions[index]?.onClick?.();
  });

  useEffect(() => {
    if (!config) {
      setActions([]);
      setMenu(null);
      return;
    }

    setActions(
      config.buttons.map((button, index) => ({
        title: button.title,
        icon: button.icon,
        disabled: button.disabled,
        variant: button.variant,
        desktopOnly: button.desktopOnly,
        onClick: () => handleButtonClick(index),
      })),
    );

    setMenu({
      ariaLabel: config.menu.ariaLabel,
      actions: config.menu.actions.map((action, index) => ({
        ...action,
        onClick: action.onClick ? () => handleMenuClick(index) : undefined,
      })),
    });

    return () => {
      setActions([]);
      setMenu(null);
    };
  }, [buttonsKey, menuKey, menuAriaLabel, setActions, setMenu, config]);
}
