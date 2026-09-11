/**
 * Pantallas de arranque de iOS para la PWA (#83).
 *
 * Sin estas, iOS muestra una pantalla en blanco mientras carga la aplicación:
 * no admite generar el splash a partir del manifest como hace Android, y exige
 * una imagen por resolución.
 *
 * La media query tiene que encajar **exactamente** con el dispositivo. Una
 * talla que falte no degrada a otra parecida: deja la pantalla en blanco, que
 * es justo el síntoma que se quería corregir.
 */
type SplashScreen = { url: string; media: string };

function media(width: number, height: number, ratio: number): string {
  return `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio})`;
}

export const APPLE_SPLASH_SCREENS: SplashScreen[] = [
  // iPhone 15 Pro Max, 15 Plus, 14 Pro Max
  { url: "/splash/1290x2796.png", media: media(430, 932, 3) },
  // iPhone 15, 15 Pro, 14 Pro
  { url: "/splash/1179x2556.png", media: media(393, 852, 3) },
  // iPhone 14 Plus, 13 Pro Max, 12 Pro Max
  { url: "/splash/1284x2778.png", media: media(428, 926, 3) },
  // iPhone 14, 13, 13 Pro, 12, 12 Pro
  { url: "/splash/1170x2532.png", media: media(390, 844, 3) },
  // iPhone 13 mini, 12 mini, 11 Pro, XS, X
  { url: "/splash/1125x2436.png", media: media(375, 812, 3) },
  // iPhone 11 Pro Max, XS Max
  { url: "/splash/1242x2688.png", media: media(414, 896, 3) },
  // iPhone 11, XR
  { url: "/splash/828x1792.png", media: media(414, 896, 2) },
  // iPhone 8 Plus, 7 Plus, 6s Plus
  { url: "/splash/1242x2208.png", media: media(414, 736, 3) },
  // iPhone SE (2ª y 3ª gen), 8, 7, 6s
  { url: "/splash/750x1334.png", media: media(375, 667, 2) },
];
