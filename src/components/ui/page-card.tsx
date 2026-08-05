import type { ReactNode } from "react";

import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";

type PageCardProps = {
  children: ReactNode;
  /** Barra de filtros; se fija arriba y no se desplaza con el contenido. */
  filters?: ReactNode;
  /** Pie fijado al borde inferior, fuera del área de scroll. */
  footer?: ReactNode;
};

/**
 * Tarjeta de contenido del sistema Aurora: superficie blanca flotando sobre el
 * lienzo, con el scroll contenido dentro para que el marco no se mueva.
 *
 * Los elementos `fixed` de la pantalla (el FAB móvil) van FUERA de esta
 * tarjeta: `overflow-hidden` los recortaría al recortar el radio.
 */
export default function PageCard({ children, filters, footer }: PageCardProps) {
  return (
    <div className="surface-card relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-dialog">
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {filters ? (
          <PageStickyFiltersSection>{filters}</PageStickyFiltersSection>
        ) : null}
        <div className="space-y-4 px-3.5 pb-3.5">{children}</div>
      </div>
      {footer}
    </div>
  );
}
