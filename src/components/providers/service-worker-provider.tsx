"use client";

import { useEffect } from "react";

type ServiceWorkerProviderProps = {
  children: React.ReactNode;
};

export default function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    void navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  }, []);

  return children;
}
