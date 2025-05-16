import fs from "fs-extra";
import path from "path";
import { getImageConfig } from "./config";

/**
 * Resolves the absolute path to an image based on the source path
 *
 * @param src - The source path of the image
 * @returns The absolute path to the image
 */
export function resolveImagePath(src: string): string {
  // If the source is an absolute path or URL, return it as is
  if (
    src.startsWith("/") ||
    src.startsWith("http") ||
    src.startsWith("data:")
  ) {
    return src;
  }

  const config = getImageConfig();
  const appDirectory = process.cwd();

  // Check if the image exists in any of the configured image directories
  for (const dir of config.imageDirs) {
    const imagePath = path.join(appDirectory, dir, src);
    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
  }

  // If not found, fallback to the default public directory
  return path.join(appDirectory, "public", src);
}

/**
 * Generates a path for the optimized image
 *
 * @param src - The source path of the image
 * @param options - Optimization options
 * @returns The path to the optimized image
 */
export function getOptimizedImagePath(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }
): string {
  const config = getImageConfig();
  const {
    width,
    height,
    quality = config.quality,
    format = config.format,
  } = options;

  // Clean the source path to use as part of the filename
  const cleanSrc = src.replace(/^\//, "").replace(/[\/\\?%*:|"<>]/g, "-");

  // Create a unique filename based on the image path and options
  const dimensions =
    width || height ? `-${width || "auto"}x${height || "auto"}` : "";
  const qualitySuffix = `-q${quality}`;
  const filename = `${path.basename(
    cleanSrc,
    path.extname(cleanSrc)
  )}${dimensions}${qualitySuffix}.${format}`;

  // Return the path in the output directory
  return path.join(config.outputPath, filename);
}

/**
 * Calculates responsive image sizes based on the base width and height
 *
 * @param baseWidth - The base width of the image
 * @param baseHeight - The base height of the image
 * @returns An array of responsive image sizes
 */
export function getResponsiveSizes(
  baseWidth?: number,
  baseHeight?: number
): Array<{ width: number; height: number }> {
  if (!baseWidth || !baseHeight) {
    return [];
  }

  const config = getImageConfig();
  const aspectRatio = baseWidth / baseHeight;

  return config.breakpoints
    .filter((width) => width <= baseWidth * 2)
    .map((width) => ({
      width,
      height: Math.round(width / aspectRatio),
    }));
}

/**
 * Ensures the output directory exists
 */
export async function ensureOutputDir(): Promise<void> {
  const config = getImageConfig();
  await fs.ensureDir(config.outputPath);

  if (config.useCache) {
    await fs.ensureDir(config.cacheDir);
  }
}
