import { create } from "zustand";

type TopbarSearchState = {
  clearQuery: () => void;
  query: string;
  setQuery: (query: string) => void;
};

export const useTopbarSearchStore = create<TopbarSearchState>((set) => ({
  clearQuery: () => set({ query: "" }),
  query: "",
  setQuery: (query) => set({ query }),
}));
