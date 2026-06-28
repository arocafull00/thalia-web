import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Thalia",
    short_name: "Thalia",
    description: "Gestión de clínicas estéticas",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfffe",
    theme_color: "#3cac8e",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
