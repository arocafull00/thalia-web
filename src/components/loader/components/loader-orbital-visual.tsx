import { LoaderSpinner } from "@/components/loader/components/loader-spinner";

export function LoaderOrbitalVisual() {
  return (
    <div className="mb-9 grid place-items-center max-sm:mb-7 max-sm:scale-90">
      <LoaderSpinner size="lg" />
    </div>
  );
}
