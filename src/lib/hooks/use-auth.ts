import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useServerBootstrap } from "@/components/providers/store-hydrator";
import { useAuthStore, type UpdateProfileInput } from "@/stores/auth-store";

export function useAuth() {
  const bootstrap = useServerBootstrap();
  const auth = useAuthStore(
    useShallow((state) => ({
      session: state.session,
      initialized: state.initialized,
      profile: state.profile,
      loading: state.loading,
      signIn: state.signIn,
      signUp: state.signUp,
      signInWithGoogle: state.signInWithGoogle,
      signOut: state.signOut,
      refreshProfile: state.refreshProfile,
    })),
  );

  const sessionUser = auth.session?.user ?? null;
  const canUseBootstrap = Boolean(
    bootstrap?.user &&
    (!auth.initialized || sessionUser?.id === bootstrap.user.id),
  );

  return {
    ...auth,
    user: sessionUser ?? (canUseBootstrap ? (bootstrap?.user ?? null) : null),
    profile:
      auth.profile ?? (canUseBootstrap ? (bootstrap?.profile ?? null) : null),
    loading: auth.loading && !canUseBootstrap,
  };
}

export function useUpdateProfile() {
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isPending = useAuthStore((state) => state.updating);
  const error = useAuthStore((state) => state.updateError);

  const mutate = useCallback(
    (
      { values }: { values: UpdateProfileInput },
      options?: { onSuccess?: () => void },
    ) => {
      updateProfile(values).then(() => options?.onSuccess?.());
    },
    [updateProfile],
  );

  return { mutate, isPending, error };
}

export function useUploadProfileAvatar() {
  const uploadProfileAvatar = useAuthStore(
    (state) => state.uploadProfileAvatar,
  );
  const isPending = useAuthStore((state) => state.uploadingAvatar);
  const error = useAuthStore((state) => state.uploadAvatarError);

  const mutate = useCallback(
    ({ file }: { file: File }, options?: { onSuccess?: () => void }) => {
      uploadProfileAvatar(file).then(() => options?.onSuccess?.());
    },
    [uploadProfileAvatar],
  );

  return { mutate, isPending, error };
}
