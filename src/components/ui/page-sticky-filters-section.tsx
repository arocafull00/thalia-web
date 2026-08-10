import type { ReactNode } from "react";

type PageStickyFiltersSectionProps = {
  children: ReactNode;
};

/**
 * Barra de filtros fijada arriba dentro de una `PageCard`.
 *
 * Lleva el fondo de la tarjeta —no es transparente— para tapar las filas que
 * pasan por debajo al hacer scroll, y repite el radio superior: al ser sticky
 * se promociona a capa propia y el recorte redondeado del contenedor puede no
 * aplicársele, dejando asomar sus esquinas cuadradas.
 */
export default function PageStickyFiltersSection({
  children,
}: PageStickyFiltersSectionProps) {
  return (
    <div
      data-slot="sticky-filters"
      className="sticky top-0 z-20 rounded-t-dialog bg-surface px-3.5 pb-3 pt-3.5"
    >
      {children}
    </div>
  );
}
