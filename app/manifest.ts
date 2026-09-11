import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Thalia",
    short_name: "Thalia",
    description: "Gestión de clínicas estéticas",
    start_url: "/",
    display: "standalone",
    background_color: "#FBFAF8",
    theme_color: "#2F7D74",
    /*
     * Los iconos son opacos a propósito (#83). Con transparencia, iOS los
     * compone sobre negro y el icono instalado sale con un marco y unas
     * esquinas negras alrededor del logo.
     *
     * Y `any` y `maskable` no pueden ser el mismo fichero: en maskable el
     * sistema recorta lo que sobresalga del 80 % central, así que la marca va
     * reducida y centrada. Compartiendo fichero, Android recortaba el logo.
     */
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
