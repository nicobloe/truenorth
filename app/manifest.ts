import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "True North - Karriere-Kompass",
    short_name: "True North",
    description: "Finde deinen beruflichen Sweet Spot mit KI und Psychologie",
    start_url: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#8D8178",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
