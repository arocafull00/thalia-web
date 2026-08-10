import PageSurface from "@/components/ui/page-surface";
import {
  PAGE_LIST_SKELETON_ROWS,
  SkeletonList,
} from "@/components/ui/primitives/skeleton-list";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Carga de ruta de toda la zona autenticada. Es lo primero que se ve al
 * navegar, antes de que el page client llegue a montarse.
 *
 * Imita la forma de un listado —barra de filtros y filas— porque es lo que hay
 * detrás en la mayoría de pantallas. Reutiliza `SkeletonList` con la misma
 * constante que los listados para que ambos pinten el mismo número de filas:
 * antes tenía sus propios bloques y al cambiar uno el otro se quedaba atrás.
 */
export default function AppRouteLoading() {
  return (
    <PageSurface busy className="gap-3 p-3.5">
      <div role="status" aria-live="polite" className="contents">
        <span className="sr-only">Cargando pantalla</span>
        <div className="flex shrink-0 items-end gap-2">
          <Skeleton className="h-9 w-full max-w-sm bg-primary-subtle/40" />
          <Skeleton className="hidden h-9 w-40 bg-primary-subtle/40 sm:block" />
          <Skeleton className="hidden h-9 w-48 bg-primary-subtle/40 sm:block" />
        </div>
        <SkeletonList count={PAGE_LIST_SKELETON_ROWS} />
      </div>
    </PageSurface>
  );
}
