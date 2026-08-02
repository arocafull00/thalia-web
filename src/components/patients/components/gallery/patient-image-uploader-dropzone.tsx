"use client";

import { CloudUpload, Plus } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "@/components/ui/dropzone";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";

import PatientImageUploaderDropzoneFileItem from "./patient-image-uploader-dropzone-file-item";

const MAX_RENDERED_PREVIEWS = 6;

type PatientImageUploaderDropzoneProps = {
  onFilesChanged: (files: File[]) => void;
};

export default function PatientImageUploaderDropzone({
  onFilesChanged,
}: PatientImageUploaderDropzoneProps) {
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const handleDropFile = useCallback(async (file: File) => {
    return {
      status: "success" as const,
      result: URL.createObjectURL(file),
    };
  }, []);
  const dropzone = useDropzone({
    onDropFile: handleDropFile,
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      },
    },
  });

  useEffect(() => {
    const files = dropzone.fileStatuses
      .filter((file) => file.status === "success")
      .map((file) => file.file);
    onFilesChanged(files);
  }, [dropzone.fileStatuses, onFilesChanged]);

  useEffect(() => {
    const nextPreviewUrls = new Set(
      dropzone.fileStatuses.flatMap((file) =>
        file.status === "success" && typeof file.result === "string"
          ? [file.result]
          : [],
      ),
    );

    for (const previewUrl of previewUrlsRef.current) {
      if (!nextPreviewUrls.has(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    }

    previewUrlsRef.current = nextPreviewUrls;
  }, [dropzone.fileStatuses]);

  useEffect(() => {
    return () => {
      for (const previewUrl of previewUrlsRef.current) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const hasFiles = dropzone.fileStatuses.length > 0;

  return (
    <Dropzone {...dropzone}>
      <div className="flex justify-between gap-4">
        <DropzoneDescription className="text-ink-secondary">
          {PATIENT_GALLERY_COPY.uploader.dropzone}
        </DropzoneDescription>
        <DropzoneMessage className="text-danger" />
      </div>

      {!hasFiles ? (
        <DropZoneArea className="rounded-2xl border border-dashed border-border bg-canvas px-4 py-2">
          <DropzoneTrigger className="flex w-full flex-col items-center gap-3 rounded-2xl bg-transparent p-6 text-center text-sm shadow-none hover:bg-transparent">
            <CloudUpload className="size-8 text-ink-muted" aria-hidden="true" />
            <div>
              <p className="font-medium text-ink">
                {PATIENT_GALLERY_COPY.uploader.chooseFile}
              </p>
              <p className="text-sm text-ink-secondary">
                {dropzone.isDragActive
                  ? PATIENT_GALLERY_COPY.uploader.dropzoneActive
                  : PATIENT_GALLERY_COPY.uploader.dropzone}
              </p>
            </div>
          </DropzoneTrigger>
        </DropZoneArea>
      ) : null}

      {hasFiles ? (
        <DropzoneFileList className="grid grid-cols-3 gap-3 p-0">
          {dropzone.fileStatuses.map((file, index) => (
            <PatientImageUploaderDropzoneFileItem
              key={file.id}
              file={file}
              showPreview={index < MAX_RENDERED_PREVIEWS}
            />
          ))}
          <DropZoneArea className="rounded-xl border border-dashed border-border bg-canvas p-0">
            <DropzoneTrigger className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl bg-transparent p-3 text-center text-xs shadow-none hover:bg-transparent">
              <Plus className="size-5 text-ink-muted" aria-hidden="true" />
              <span className="font-medium text-ink-secondary">
                {PATIENT_GALLERY_COPY.uploader.addMore}
              </span>
            </DropzoneTrigger>
          </DropZoneArea>
        </DropzoneFileList>
      ) : null}
    </Dropzone>
  );
}
