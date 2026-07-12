import { useEffect, useEffectEvent } from "react";

import type { TopbarAction } from "@/stores/topbar-action-store";
import { useTopbarActionStore } from "@/stores/topbar-action-store";

export type TopbarActionConfig = Omit<TopbarAction, "onClick"> & {
  onClick: () => void;
};

export function useTopbarAction(config: TopbarActionConfig | null) {
  const setAction = useTopbarActionStore((state) => state.setAction);
  const onClick = useEffectEvent(() => {
    config?.onClick();
  });
  const title = config?.title;
  const icon = config?.icon;
  const disabled = config?.disabled;

  useEffect(() => {
    if (!title) {
      setAction(null);
      return;
    }

    setAction({
      title,
      icon,
      disabled,
      onClick: () => onClick(),
    });

    return () => setAction(null);
  }, [title, icon, disabled, setAction]);
}
