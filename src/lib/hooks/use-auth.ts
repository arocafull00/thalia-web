import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useServerBootstrap } from "@/components/providers/store-hydrator";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  invalidateEmployeeDirectory,
  setEmployeeQueryData,
} from "@/lib/query/employees-query";
import { useAuthStore, type UpdateProfileInput } from "@/stores/auth-store";
import type { Employee } from "@/types/database.types";

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
  const syncEmployee = useSyncEmployeeQueries();

  const mutateAsync = useCallback(
    async ({ values }: { values: UpdateProfileInput }) => {
      const employee = await updateProfile(values);
      await syncEmployee(employee);
      return employee;
    },
    [syncEmployee, updateProfile],
  );

  const mutate = useCallback(
    (
      { values }: { values: UpdateProfileInput },
      options?: { onSuccess?: () => void },
    ) => {
      void mutateAsync({ values }).then(() => options?.onSuccess?.());
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, isPending, error };
}

export function useUploadProfileAvatar() {
  const uploadProfileAvatar = useAuthStore(
    (state) => state.uploadProfileAvatar,
  );
  const isPending = useAuthStore((state) => state.uploadingAvatar);
  const error = useAuthStore((state) => state.uploadAvatarError);
  const syncEmployee = useSyncEmployeeQueries();

  const mutateAsync = useCallback(
    async ({ file }: { file: File }) => {
      const employee = await uploadProfileAvatar(file);
      await syncEmployee(employee);
      return employee;
    },
    [syncEmployee, uploadProfileAvatar],
  );

  const mutate = useCallback(
    ({ file }: { file: File }, options?: { onSuccess?: () => void }) => {
      void mutateAsync({ file }).then(() => options?.onSuccess?.());
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, isPending, error };
}

function useSyncEmployeeQueries() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const clinicId = useClinicId();
  const userId = user?.id ?? null;

  return useCallback(
    async (employee: Employee) => {
      if (!userId || !clinicId) {
        return;
      }

      const scope = { userId, clinicId };
      setEmployeeQueryData(queryClient, scope, employee);
      await invalidateEmployeeDirectory(queryClient, scope);
    },
    [clinicId, queryClient, userId],
  );
}
