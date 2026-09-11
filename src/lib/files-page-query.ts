import { endOfDay, startOfDay } from "date-fns";

import { PATIENT_FILE_CATEGORY_OPTIONS } from "@/copy/patient-files-copy";
import type {
  GlobalPatientFilesParams,
  PatientFilesSort,
} from "@/dal/patient-files.dal";
import {
  formatLocalDateInputValue,
  parseLocalDateInputValue,
} from "@/lib/date-input";
import type { PatientFileCategory } from "@/types/database.types";

export const FILES_PAGE_SIZE = 20;

const sortValues: PatientFilesSort[] = [
  "newest",
  "oldest",
  "name_asc",
  "name_desc",
];

function parsePage(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseCategory(value: string): PatientFileCategory | null {
  return PATIENT_FILE_CATEGORY_OPTIONS.some((option) => option.value === value)
    ? (value as PatientFileCategory)
    : null;
}

function parseSort(value: string): PatientFilesSort {
  return sortValues.includes(value as PatientFilesSort)
    ? (value as PatientFilesSort)
    : "newest";
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = parseLocalDateInputValue(value);

  if (
    Number.isNaN(parsed.getTime()) ||
    formatLocalDateInputValue(parsed) !== value
  ) {
    return null;
  }

  return parsed;
}

function toStartIso(value: string) {
  const date = parseDate(value);
  return date ? startOfDay(date).toISOString() : null;
}

function toEndIso(value: string) {
  const date = parseDate(value);
  return date ? endOfDay(date).toISOString() : null;
}

export function buildFilesQueryFromSearchParams(params: {
  category?: string;
  from?: string;
  page?: string;
  q?: string;
  sort?: string;
  to?: string;
}): Omit<GlobalPatientFilesParams, "clinicId"> {
  const filters = {
    category: params.category?.trim() ?? "",
    from: params.from?.trim() ?? "",
    page: params.page?.trim() ?? "1",
    q: params.q?.trim() ?? "",
    sort: params.sort?.trim() ?? "newest",
    to: params.to?.trim() ?? "",
  };

  return {
    category: parseCategory(filters.category),
    createdFrom: toStartIso(filters.from),
    createdTo: toEndIso(filters.to),
    page: parsePage(filters.page),
    pageSize: FILES_PAGE_SIZE,
    patientSearch: filters.q,
    sort: parseSort(filters.sort),
  };
}
