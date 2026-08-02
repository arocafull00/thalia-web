"use client";

import { CloudUpload } from "lucide-react";
import { useEffect } from "react";

import CampaignImageDropzoneFileItem from "@/components/marketing/components/form/campaign-image-dropzone-file-item";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "@/components/ui/dropzone";

const { image } = MARKETING_COPY;

type CampaignImageFieldProps = {
  onFileChange: (file: File | null) => void;
};

export default function CampaignImageField({
  onFileChange,
}: CampaignImageFieldProps) {
  const dropzone = useDropzone({
    onDropFile: async (file: File) => ({
      status: "success",
      result: URL.createObjectURL(file),
    }),
    validation: {
      // Sin tope de tamaño: las grandes se comprimen al subir.
      accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
      maxFiles: 1,
    },
  });

  const { fileStatuses } = dropzone;

  useEffect(() => {
    const selected = fileStatuses.find((entry) => entry.status === "success");
    onFileChange(selected?.file ?? null);
  }, [fileStatuses, onFileChange]);

  useEffect(() => {
    return () => {
      for (const entry of fileStatuses) {
        if (entry.status === "success" && typeof entry.result === "string") {
          URL.revokeObjectURL(entry.result);
        }
      }
    };
  }, [fileStatuses]);

  const hasFile = fileStatuses.length > 0;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-ink">{image.label}</h3>
      <Dropzone {...dropzone}>
        <div className="flex justify-between gap-4">
          <DropzoneDescription className="text-ink-secondary">
            {image.dropzone}
          </DropzoneDescription>
          <DropzoneMessage className="text-danger" />
        </div>
        {hasFile ? (
          <DropzoneFileList className="p-0">
            {fileStatuses.map((entry) => (
              <CampaignImageDropzoneFileItem key={entry.id} file={entry} />
            ))}
          </DropzoneFileList>
        ) : (
          <DropZoneArea className="rounded-2xl border border-dashed border-border bg-canvas px-4 py-2">
            <DropzoneTrigger className="flex w-full flex-col items-center gap-3 rounded-2xl bg-transparent p-6 text-center text-sm shadow-none hover:bg-transparent">
              <CloudUpload
                className="size-8 text-ink-muted"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-ink">{image.chooseFile}</p>
                <p className="text-sm text-ink-secondary">
                  {dropzone.isDragActive
                    ? image.dropzoneActive
                    : image.dropzone}
                </p>
              </div>
            </DropzoneTrigger>
          </DropZoneArea>
        )}
      </Dropzone>
    </div>
  );
}
