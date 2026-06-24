import { employeeRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth, useUploadProfileAvatar } from "@/lib/hooks/use-auth";
import { useEmployees } from "@/lib/hooks/use-employees";
import { usePendingClinicRequests } from "@/lib/hooks/use-pending-clinic-requests";
import { supabase } from "@/lib/supabase";
import { useSettingsUiStore } from "@/stores/settings-ui-store";
import type { EmployeeRole } from "@/types/database.types";

export function buildProfileSubtitle(specialty: string | null, role: EmployeeRole) {
  const roleLabel = employeeRoleLabel(role).toUpperCase();
  const specialtyLabel = specialty?.toUpperCase();

  if (specialtyLabel) {
    return `${specialtyLabel} • ${roleLabel}`;
  }

  return roleLabel;
}

export function useSettingsPageActions() {
  const { platformRole } = useActiveClinic();
  const { profile, signOut, user } = useAuth();
  const canViewClinicRequests = platformRole === "employee" || platformRole === "external";
  const { requests: pendingClinicRequests } = usePendingClinicRequests(
    user?.email,
    canViewClinicRequests,
  );
  const employees = useEmployees();
  const passwordMessage = useSettingsUiStore((state) => state.passwordMessage);
  const passwordSubmitting = useSettingsUiStore((state) => state.passwordSubmitting);
  const signOutSubmitting = useSettingsUiStore((state) => state.signOutSubmitting);
  const localAvatarUri = useSettingsUiStore((state) => state.localAvatarUri);
  const setPasswordMessage = useSettingsUiStore((state) => state.setPasswordMessage);
  const setPasswordSubmitting = useSettingsUiStore((state) => state.setPasswordSubmitting);
  const setSignOutSubmitting = useSettingsUiStore((state) => state.setSignOutSubmitting);
  const setLocalAvatarUri = useSettingsUiStore((state) => state.setLocalAvatarUri);
  const uploadAvatar = useUploadProfileAvatar();

  const isAdmin = profile?.role === "admin";
  const activeEmployeesCount = employees.data?.filter((employee) => employee.active).length ?? 0;

  const handleChangePassword = async () => {
    if (!user?.email) {
      setPasswordMessage("No hay un email asociado a esta cuenta.");
      return;
    }

    setPasswordSubmitting(true);
    setPasswordMessage(null);

    const origin = typeof globalThis.location !== "undefined" ? globalThis.location.origin : "";
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${origin}/login`,
    });

    setPasswordSubmitting(false);

    if (error) {
      setPasswordMessage(error.message);
      return;
    }

    setPasswordMessage("Revisa tu email para crear una nueva contraseña.");
  };

  const handleSignOut = async () => {
    setSignOutSubmitting(true);

    try {
      await signOut();
      globalThis.location.href = "/login";
    } catch {
      setSignOutSubmitting(false);
    }
  };

  const handleAvatarPress = (imageUri: string) => {
    setLocalAvatarUri(imageUri);
    uploadAvatar.mutate({ imageUri });
  };

  return {
    activeEmployeesCount,
    canViewClinicRequests,
    handleAvatarPress,
    handleChangePassword,
    handleSignOut,
    isAdmin,
    localAvatarUri,
    passwordMessage,
    passwordSubmitting,
    pendingClinicRequests,
    profile,
    signOutSubmitting,
    uploadAvatar,
    user,
  };
}
