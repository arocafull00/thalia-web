import { useServerBootstrap } from "@/components/providers/store-hydrator";

export function useServerSeed<T>(
  currentKey: string,
  serverKey: string,
  data: T,
): T | undefined {
  if (currentKey !== serverKey) {
    return undefined;
  }

  return data;
}

export function useClinicServerSeed<T>(
  currentClinicId: string | null,
  data: T,
): T | undefined {
  const bootstrap = useServerBootstrap();

  return useServerSeed(
    currentClinicId ?? "",
    bootstrap?.activeClinicId ?? "",
    data,
  );
}
