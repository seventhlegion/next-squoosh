import type { ImageManifest } from "../types/image-manifest";

let manifest: ImageManifest = {};

async function loadManifest() {
  if (import.meta.env.MODE === "production") {
    try {
      manifest = await import("../types/image-manifest.json").then(
        (m) => m.default
      );
    } catch (e) {
      console.warn("Missing image-manifest.json");
    }
  }
}

loadManifest();

export default manifest;
