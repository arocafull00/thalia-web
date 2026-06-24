import { createJSONStorage, type StateStorage } from "zustand/middleware";

const webStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(name);
  },
};

export function createWebPersistStorage() {
  return createJSONStorage(() => webStorage);
}
