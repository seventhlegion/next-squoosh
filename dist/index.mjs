// src/utils/get-image-manifest.ts
var manifest = {};
async function loadManifest() {
  if (import.meta.env.MODE === "production") {
    try {
      manifest = await import("./image-manifest-II6YHNPC.mjs").then(
        (m) => m.default
      );
    } catch (e) {
      console.warn("Missing image-manifest.json");
    }
  }
}
loadManifest();
var get_image_manifest_default = manifest;

// src/components/passepartout.tsx
import { jsx } from "react/jsx-runtime";
var Passepartout = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  priority = false,
  loading = "lazy",
  placeholder = "empty",
  blurDataURL,
  style,
  className,
  ...props
}) => {
  const manifestEntry = get_image_manifest_default?.[src];
  const optimizedSrc = import.meta.env.MODE === "production" && manifestEntry?.webp ? manifestEntry.webp : src;
  const finalWidth = width || manifestEntry?.width;
  const finalHeight = height || manifestEntry?.height;
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: optimizedSrc,
      alt,
      width: finalWidth,
      height: finalHeight,
      loading: priority ? "eager" : loading,
      style,
      className,
      ...props
    }
  );
};

// src/utils/optimizer.ts
import { exec } from "child_process";
import { readFile, unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import sharp from "sharp";
import { promisify } from "util";
var execAsync = promisify(exec);
async function optimizeImage(src, options = {}) {
  const { quality = 80, format = "webp", width, height } = options;
  const tempDir = tmpdir();
  const inputPath = join(tempDir, `input-${Date.now()}.${format}`);
  const outputPath = join(tempDir, `output-${Date.now()}.${format}`);
  try {
    const response = await fetch(src);
    const buffer = await response.arrayBuffer();
    await writeFile(inputPath, Buffer.from(buffer));
    let sharpInstance = sharp(inputPath);
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true
      });
    }
    const processedBuffer = await sharpInstance.webp({ quality }).toBuffer();
    await writeFile(outputPath, processedBuffer);
    await execAsync(
      `npx @squoosh/cli --mozjpeg '{"quality":${quality}}' ${outputPath}`
    );
    const optimizedBuffer = await readFile(outputPath);
    const base64 = optimizedBuffer.toString("base64");
    const dataUrl = `data:image/${format};base64,${base64}`;
    return dataUrl;
  } finally {
    try {
      await unlink(inputPath);
      await unlink(outputPath);
    } catch (error) {
      console.error("Error cleaning up temporary files:", error);
    }
  }
}
export {
  Passepartout,
  optimizeImage
};
