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
    <div className="surface-card-glass relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-dialog">
      {/*
        Fuera del contenedor que scrollea, igual que el pie. Dentro tenía que
        ser `sticky` y llevar fondo propio para tapar las filas que le pasaban
        por debajo, y ese fondo se sumaba al de la tarjeta: la banda salía
        siempre de otro tono que la lista. Como hermana no se solapa con nada,
        así que no necesita fondo y enseña la tarjeta tal cual.
      */}
      {filters ? (
        <PageStickyFiltersSection>{filters}</PageStickyFiltersSection>
      ) : null}
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4 px-3.5 pb-3.5">{children}</div>
      </div>
      {footer}
    </div>
  );
}
