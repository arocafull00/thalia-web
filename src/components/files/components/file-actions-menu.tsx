"use client";

import { Download, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";
import { isPatientFileViewable } from "@/lib/patient-file-storage";
import type { PatientFileWithPatient } from "@/types/database.types";

type FileActionsMenuProps = {
  file: PatientFileWithPatient;
  onView: (file: PatientFileWithPatient) => void;
  onDownload: (file: PatientFileWithPatient) => void;
  onDelete: (file: PatientFileWithPatient) => void;
};

export default function FileActionsMenu({
  file,
  onView,
  onDownload,
  onDelete,
}: FileActionsMenuProps) {
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={PATIENT_FILES_COPY.actions.rowMenu}
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isPatientFileViewable(file.mime_type) ? (
            <DropdownMenuItem onClick={() => onView(file)}>
              <Eye aria-hidden="true" />
              {PATIENT_FILES_COPY.actions.view}
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={() => onDownload(file)}>
            <Download aria-hidden="true" />
            {PATIENT_FILES_COPY.actions.download}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(file)}
          >
            <Trash2 aria-hidden="true" />
            {PATIENT_FILES_COPY.actions.delete}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
