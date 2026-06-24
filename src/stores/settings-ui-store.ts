import { create } from "zustand";

type SettingsUiStore = {
  localAvatarUri: string | null;
  passwordMessage: string | null;
  passwordSubmitting: boolean;
  signOutSubmitting: boolean;
  setLocalAvatarUri: (uri: string | null) => void;
  setPasswordMessage: (message: string | null) => void;
  setPasswordSubmitting: (submitting: boolean) => void;
  setSignOutSubmitting: (submitting: boolean) => void;
};

export const useSettingsUiStore = create<SettingsUiStore>((set) => ({
  localAvatarUri: null,
  passwordMessage: null,
  passwordSubmitting: false,
  signOutSubmitting: false,
  setLocalAvatarUri: (localAvatarUri) => set({ localAvatarUri }),
  setPasswordMessage: (passwordMessage) => set({ passwordMessage }),
  setPasswordSubmitting: (passwordSubmitting) => set({ passwordSubmitting }),
  setSignOutSubmitting: (signOutSubmitting) => set({ signOutSubmitting }),
}));
