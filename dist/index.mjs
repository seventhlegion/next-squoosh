import { useState, useEffect } from 'react';
import { exec } from 'child_process';
import { writeFile, readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import sharp from 'sharp';
import { promisify } from 'util';
import { jsx } from 'react/jsx-runtime';

// src/components/passepartout.tsx
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
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const optimize = async () => {
      try {
        setIsLoading(true);
        const optimized = await optimizeImage(src, {
          quality,
          format: "webp",
          width,
          height
        });
        setOptimizedSrc(optimized);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to optimize image")
        );
      } finally {
        setIsLoading(false);
      }
    };
    optimize();
  }, [src, quality, width, height]);
  const imageStyle = {
    ...style,
    opacity: isLoading ? 0.5 : 1,
    transition: "opacity 0.3s ease-in-out"
  };
  if (error) {
    console.error("Image optimization error:", error);
    return /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt,
        width,
        height,
        style,
        className,
        ...props
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: optimizedSrc,
      alt,
      width,
      height,
      loading: priority ? "eager" : loading,
      style: imageStyle,
      className,
      ...props
    }
  );
};

export { Passepartout, optimizeImage };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map