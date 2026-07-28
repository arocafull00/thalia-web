export type TimedAppointment = {
  id: string;
  starts_at: string;
  ends_at: string;
};

export type OverlapGroup<T extends TimedAppointment> = {
  id: string;
  appointments: T[];
  startMs: number;
  endMs: number;
};

export type OverlapPartition<T extends TimedAppointment> = {
  singles: T[];
  groups: OverlapGroup<T>[];
};

export type ProfessionalColor = {
  name: string;
  color: string | null;
};

function toIntervalMs(appointment: TimedAppointment) {
  return {
    startMs: new Date(appointment.starts_at).getTime(),
    endMs: new Date(appointment.ends_at).getTime(),
  };
}

export function intervalsOverlap(
  leftStartMs: number,
  leftEndMs: number,
  rightStartMs: number,
  rightEndMs: number,
): boolean {
  return leftStartMs < rightEndMs && rightStartMs < leftEndMs;
}

function buildGroupId(dayKey: string, index: number) {
  return `group-${dayKey}-${index}`;
}

export function groupOverlappingAppointments<T extends TimedAppointment>(
  appointments: T[],
  dayKey: string,
): OverlapPartition<T> {
  if (appointments.length === 0) {
    return { singles: [], groups: [] };
  }

  const sorted = [...appointments].sort(
    (left, right) =>
      new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime(),
  );

  const singles: T[] = [];
  const groups: OverlapGroup<T>[] = [];
  let cluster: T[] = [];
  let clusterStartMs = 0;
  let clusterEndMs = 0;

  function flushCluster() {
    if (cluster.length === 0) {
      return;
    }

    if (cluster.length === 1) {
      singles.push(cluster[0]!);
    } else {
      groups.push({
        id: buildGroupId(dayKey, groups.length),
        appointments: cluster,
        startMs: clusterStartMs,
        endMs: clusterEndMs,
      });
    }

    cluster = [];
    clusterStartMs = 0;
    clusterEndMs = 0;
  }

  for (const appointment of sorted) {
    const { startMs, endMs } = toIntervalMs(appointment);

    if (cluster.length === 0) {
      cluster = [appointment];
      clusterStartMs = startMs;
      clusterEndMs = endMs;
      continue;
    }

    if (intervalsOverlap(clusterStartMs, clusterEndMs, startMs, endMs)) {
      cluster.push(appointment);
      clusterEndMs = Math.max(clusterEndMs, endMs);
      continue;
    }

    flushCluster();
    cluster = [appointment];
    clusterStartMs = startMs;
    clusterEndMs = endMs;
  }

  flushCluster();

  return { singles, groups };
}

export function groupOverlappingAppointmentsByDay<T extends TimedAppointment>(
  appointments: T[],
  getDayKey: (appointment: T) => string,
): OverlapPartition<T> {
  const byDay = new Map<string, T[]>();

  for (const appointment of appointments) {
    const dayKey = getDayKey(appointment);
    const existing = byDay.get(dayKey) ?? [];
    existing.push(appointment);
    byDay.set(dayKey, existing);
  }

  const singles: T[] = [];
  const groups: OverlapGroup<T>[] = [];

  for (const [dayKey, dayAppointments] of byDay) {
    const partition = groupOverlappingAppointments(dayAppointments, dayKey);
    singles.push(...partition.singles);
    groups.push(...partition.groups);
  }

  return { singles, groups };
}

export function formatProfessionalSummary(
  names: string[],
  maxVisible = 3,
): string {
  const uniqueNames = [...new Set(names.filter(Boolean))];

  if (uniqueNames.length === 0) {
    return "";
  }

  if (uniqueNames.length <= maxVisible) {
    return uniqueNames.join(", ");
  }

  const visible = uniqueNames.slice(0, maxVisible);
  const remaining = uniqueNames.length - maxVisible;
  return `${visible.join(", ")} y ${remaining} más`;
}

export function collectUniqueProfessionalColors<T extends TimedAppointment>(
  getName: (appointment: T) => string | null,
  getColor: (appointment: T) => string | null,
  appointments: T[],
): ProfessionalColor[] {
  const seen = new Set<string>();
  const result: ProfessionalColor[] = [];

  for (const appointment of appointments) {
    const name = getName(appointment);
    if (!name || seen.has(name)) {
      continue;
    }

    seen.add(name);
    result.push({ name, color: getColor(appointment) });
  }

  return result;
}

export function isOverlapGroupEventId(eventId: string) {
  return eventId.startsWith("group-");
}
