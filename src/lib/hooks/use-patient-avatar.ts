import { useCallback, useEffect, useMemo, useState } from "react";

import { useFileUrl } from "@/lib/hooks/use-file-url";
import { useUploadPatientAvatar } from "@/lib/hooks/use-patients";
import { compressAvatarImage } from "@/lib/image-compression";
import { withFileUrlCacheBust } from "@/lib/storage";
import type { Patient } from "@/types/database.types";

function getPatientAvatarKey(
  patient: Patient | null | undefined,
): string | null {
  if (!patient) {
    return null;
  }

  return `${patient.id}:${patient.avatar_url ?? ""}:${patient.updated_at ?? ""}`;
}

export function usePatientAvatar(patient: Patient | null | undefined) {
  const uploadAvatar = useUploadPatientAvatar();
  const [localPreview, setLocalPreview] = useState<{
    patientAvatarKey: string;
    uri: string;
  } | null>(null);
  const resolvedAvatarUrl = useFileUrl(patient?.avatar_url ?? null);
  const patientAvatarKey = getPatientAvatarKey(patient);

  const activeLocalUri =
    localPreview &&
    patientAvatarKey &&
    localPreview.patientAvatarKey === patientAvatarKey
      ? localPreview.uri
      : null;

  const avatarDisplayUri = useMemo(() => {
    if (activeLocalUri) {
      return activeLocalUri;
    }

    return withFileUrlCacheBust(resolvedAvatarUrl, patient?.updated_at ?? null);
  }, [activeLocalUri, patient?.updated_at, resolvedAvatarUrl]);

  useEffect(() => {
    if (!localPreview) {
      return;
    }

    if (
      patientAvatarKey &&
      localPreview.patientAvatarKey === patientAvatarKey
    ) {
      return () => {
        URL.revokeObjectURL(localPreview.uri);
      };
    }

    URL.revokeObjectURL(localPreview.uri);
  }, [localPreview, patientAvatarKey]);

  const onAvatarFileSelected = useCallback(
    async (file: File) => {
      if (!patient || !patientAvatarKey) {
        return;
      }

      const compressedFile = await compressAvatarImage(file);
      const previewUrl = URL.createObjectURL(compressedFile);

      setLocalPreview((current) => {
        if (current) {
          URL.revokeObjectURL(current.uri);
        }

        return { patientAvatarKey, uri: previewUrl };
      });

      uploadAvatar.mutate({ patientId: patient.id, file: compressedFile });
    },
    [patient, patientAvatarKey, uploadAvatar],
  );

  return {
    avatarDisplayUri,
    avatarUploadPending: uploadAvatar.isPending,
    onAvatarFileSelected,
  };
}
