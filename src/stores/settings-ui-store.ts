import { create } from "zustand";

type SettingsUiStore = {
  hoursDialogOpen: boolean;
  localAvatarUri: string | null;
  passwordMessage: string | null;
  passwordSubmitting: boolean;
  signOutSubmitting: boolean;
  setHoursDialogOpen: (open: boolean) => void;
  setLocalAvatarUri: (uri: string | null) => void;
  setPasswordMessage: (message: string | null) => void;
  setPasswordSubmitting: (submitting: boolean) => void;
  setSignOutSubmitting: (submitting: boolean) => void;
};

export const useSettingsUiStore = create<SettingsUiStore>((set) => ({
  hoursDialogOpen: false,
  localAvatarUri: null,
  passwordMessage: null,
  passwordSubmitting: false,
  signOutSubmitting: false,
  setHoursDialogOpen: (hoursDialogOpen) => set({ hoursDialogOpen }),
  setLocalAvatarUri: (localAvatarUri) => set({ localAvatarUri }),
  setPasswordMessage: (passwordMessage) => set({ passwordMessage }),
  setPasswordSubmitting: (passwordSubmitting) => set({ passwordSubmitting }),
  setSignOutSubmitting: (signOutSubmitting) => set({ signOutSubmitting }),
}));
