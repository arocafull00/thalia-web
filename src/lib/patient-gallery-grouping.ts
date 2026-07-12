import { format, isToday, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import type { PatientImage } from "@/types/database.types";

export type PatientGalleryDateGroup = {
  dateGroupLabel: string;
  sortIndex: number;
  images: PatientImage[];
};

function getDateGroupLabel(capturedAt: string) {
  const date = parseISO(capturedAt);

  if (isToday(date)) {
    return "Hoy";
  }

  return format(date, "d MMM yyyy", { locale: es });
}

function getSortIndex(capturedAt: string) {
  return parseISO(capturedAt).getTime();
}

export function groupImagesByDate(
  images: PatientImage[],
  sortOrder: "recent" | "oldest" = "recent",
) {
  const groups = new Map<string, PatientGalleryDateGroup>();

  for (const image of images) {
    const capturedAt = image.captured_at ?? image.created_at;

    if (!capturedAt) {
      continue;
    }

    const dateGroupLabel = getDateGroupLabel(capturedAt);
    const existingGroup = groups.get(dateGroupLabel);

    if (existingGroup) {
      existingGroup.images.push(image);
      continue;
    }

    groups.set(dateGroupLabel, {
      dateGroupLabel,
      sortIndex: getSortIndex(capturedAt),
      images: [image],
    });
  }

  return [...groups.values()].toSorted((left, right) => {
    return sortOrder === "recent"
      ? right.sortIndex - left.sortIndex
      : left.sortIndex - right.sortIndex;
  });
}
