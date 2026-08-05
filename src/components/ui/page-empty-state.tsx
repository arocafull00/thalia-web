type PageEmptyStateProps = {
  message: string;
};

/**
 * Estado vacío de un listado dentro de una `PageCard`: recuadro punteado que
 * ocupa el hueco de la tabla sin fingir que hay contenido.
 */
export default function PageEmptyState({ message }: PageEmptyStateProps) {
  return (
    <div className="rounded-card border border-dashed border-border p-10 text-center text-ink-secondary">
      {message}
    </div>
  );
}
