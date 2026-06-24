import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useAuthStore, type UpdateProfileInput } from "@/stores/auth-store";

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      session: state.session,
      user: state.session?.user ?? null,
      profile: state.profile,
      loading: state.loading,
      signIn: state.signIn,
      signUp: state.signUp,
      signInWithGoogle: state.signInWithGoogle,
      signOut: state.signOut,
      refreshProfile: state.refreshProfile,
    })),
  );
}

export function useUpdateProfile() {
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isPending = useAuthStore((state) => state.updating);
  const error = useAuthStore((state) => state.updateError);

  const mutate = useCallback(
    ({ values }: { values: UpdateProfileInput }, options?: { onSuccess?: () => void }) => {
      updateProfile(values).then(() => options?.onSuccess?.());
    },
    [updateProfile],
  );

  return { mutate, isPending, error };
}

export function useUploadProfileAvatar() {
  const uploadProfileAvatar = useAuthStore((state) => state.uploadProfileAvatar);
  const isPending = useAuthStore((state) => state.uploadingAvatar);
  const error = useAuthStore((state) => state.uploadAvatarError);

  const mutate = useCallback(
    ({ imageUri }: { imageUri: string }, options?: { onSuccess?: () => void }) => {
      uploadProfileAvatar(imageUri).then(() => options?.onSuccess?.());
    },
    [uploadProfileAvatar],
  );

  return { mutate, isPending, error };
}
