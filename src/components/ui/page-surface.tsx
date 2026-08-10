import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageSurfaceProps = {
  children: ReactNode;
  className?: string;
  busy?: boolean;
};

/**
 * Tarjeta simple para los estados que ocupan la pantalla entera sin ser un
 * listado: carga, error o falta de permisos.
 *
 * Comparte superficie con `PageCard` para que el contenido no quede suelto
 * sobre el lienzo. `PageCard` no sirve aquí porque además gestiona el scroll,
 * la barra de filtros fija y el pie, que estos estados no tienen.
 */
export default function PageSurface({
  children,
  className,
  busy,
}: PageSurfaceProps) {
  return (
    <div
      aria-busy={busy}
      className={cn(
        "surface-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-dialog p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
