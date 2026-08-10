import type { ReactNode } from "react";

type PageCardFooterProps = {
  children: ReactNode;
};

/**
 * Pie de la tarjeta de contenido: queda fijado al borde inferior, fuera del
 * área de scroll. Pensado para recuentos y acciones de listado.
 */
export default function PageCardFooter({ children }: PageCardFooterProps) {
  return (
    <div className="flex items-center gap-2.5 border-t border-border px-3.5 py-3 text-xs text-ink-secondary">
      {children}
    </div>
  );
}
