import type { ReactNode } from "react";

type PageStickyFiltersSectionProps = {
  children: ReactNode;
};

/**
 * Barra de filtros en la cabecera de una `PageCard`.
 *
 * No pinta superficie de ninguna clase: se apoya en el cristal de la tarjeta,
 * el mismo que se ve bajo la lista. Es lo que hace que toda la sección central
 * sea un único fondo y no dos parecidos.
 *
 * Puede permitírselo porque `PageCard` la coloca FUERA del contenedor que
 * scrollea, así que nada le pasa por debajo. Mientras estuvo dentro necesitaba
 * ser `sticky` y opacar el contenido, y cualquier relleno se sumaba al de la
 * tarjeta y la dejaba de otro tono. Si alguien la devuelve al área de scroll,
 * vuelve el problema.
 */
export default function PageStickyFiltersSection({
  children,
}: PageStickyFiltersSectionProps) {
  return (
    <div
      data-slot="sticky-filters"
      // `shrink-0` para que no la encoja el área de scroll al crecer la lista.
      className="shrink-0 px-3.5 pb-3 pt-3.5"
    >
      {children}
    </div>
  );
}
