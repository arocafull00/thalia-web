/**
 * Fondo del shell, en z-0. Queda por debajo del sidebar (z-10) y de las
 * tarjetas de navbar y contenido (z-20), que son blancas opacas: el beige sólo
 * se ve por los cuatro extremos de la app y por los huecos entre tarjetas.
 */
export default function AppBackdrop() {
  return <div className="app-backdrop" aria-hidden="true" />;
}
