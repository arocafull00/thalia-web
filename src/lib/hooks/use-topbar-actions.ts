import { useEffect, useEffectEvent } from "react";

import type { ProfileActionSection } from "@/components/ui/profile/profile-action";
import type { TopbarAction } from "@/stores/topbar-action-store";
import { useTopbarActionStore } from "@/stores/topbar-action-store";

export type TopbarActionButtonConfig = Omit<TopbarAction, "onClick"> & {
  onClick: () => void;
};

export type TopbarActionsConfig = {
  buttons: TopbarActionButtonConfig[];
  menu?: {
    sections: ProfileActionSection[];
    ariaLabel: string;
  };
};

function flattenMenuSections(sections: ProfileActionSection[]) {
  return sections.flatMap((section) => section.actions);
}

export function useTopbarActions(config: TopbarActionsConfig | null) {
  const setActions = useTopbarActionStore((state) => state.setActions);
  const setMenu = useTopbarActionStore((state) => state.setMenu);
  const buttonsKey =
    config?.buttons
      .map(
        (button) =>
          `${button.title}:${button.variant ?? "solid"}:${button.disabled ?? false}:${button.testId ?? ""}`,
      )
      .join("|") ?? "";
  const menuKey =
    config?.menu?.sections
      .flatMap((section) =>
        section.actions.map(
          (action) =>
            `${section.label}:${action.label}:${action.disabled ?? false}`,
        ),
      )
      .join("|") ?? "";
  const menuAriaLabel = config?.menu?.ariaLabel;

  const handleButtonClick = useEffectEvent((index: number) => {
    config?.buttons[index]?.onClick();
  });

  const handleMenuClick = useEffectEvent((index: number) => {
    if (!config) {
      return;
    }

    flattenMenuSections(config.menu?.sections ?? [])[index]?.onClick?.();
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
        iconClassName: button.iconClassName,
        disabled: button.disabled,
        variant: button.variant,
        desktopOnly: button.desktopOnly,
        testId: button.testId,
        onClick: () => handleButtonClick(index),
      })),
    );

    if (!config.menu) {
      setMenu(null);

      return () => {
        setActions([]);
        setMenu(null);
      };
    }

    let actionIndex = 0;

    setMenu({
      ariaLabel: config.menu.ariaLabel,
      sections: config.menu.sections.map((section) => ({
        label: section.label,
        actions: section.actions.map((action) => {
          const currentIndex = actionIndex;
          actionIndex += 1;

          return {
            ...action,
            onClick: action.onClick
              ? () => handleMenuClick(currentIndex)
              : undefined,
          };
        }),
      })),
    });

    return () => {
      setActions([]);
      setMenu(null);
    };
  }, [buttonsKey, menuKey, menuAriaLabel, setActions, setMenu, config]);
}
