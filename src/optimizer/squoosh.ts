import { SquooshOptions, ImageFormat } from "../types";
import path from "path";
import fs from "fs-extra";
import { getImageConfig } from "../utils/config";
import { execSync } from "child_process";
import crypto from "crypto";

// Create a hash of the image and options for caching
function createCacheKey(imagePath: string, options: SquooshOptions): string {
  const content = fs.readFileSync(imagePath);
  const hash = crypto
    .createHash("md5")
    .update(content)
    .update(JSON.stringify(options))
    .digest("hex");

  return hash;
}

// Check if the image is already cached
function checkCache(imagePath: string, options: SquooshOptions): string | null {
  const config = getImageConfig();
  if (!config.useCache) return null;

  const hash = createCacheKey(imagePath, options);
  const ext = getOutputExtension(options.format);
  const cacheFilePath = path.join(
    config.cacheDir,
    `${path.basename(imagePath, path.extname(imagePath))}.${hash}.${ext}`
  );

  return fs.existsSync(cacheFilePath) ? cacheFilePath : null;
}

// Get output file extension based on format
function getOutputExtension(format: ImageFormat): string {
  const extMap: Record<ImageFormat, string> = {
    mozjpeg: "jpg",
    webp: "webp",
    avif: "avif",
    png: "png",
    jxl: "jxl",
    wp2: "wp2",
    original: "",
  };

  return extMap[format] || path.extname(format).substring(1) || format;
}

// Build Squoosh CLI command options
function buildSquooshOptions(options: SquooshOptions): string[] {
  const cliOptions: string[] = [];
  const { format, quality, resize, width, height, preserveAspectRatio } =
    options;

  // Add format-specific options
  switch (format) {
    case "mozjpeg":
      cliOptions.push("--mozjpeg", `{"quality":${quality}}`);
      break;
    case "webp":
      cliOptions.push("--webp", `{"quality":${quality}}`);
      break;
    case "avif":
      cliOptions.push("--avif", `{"quality":${quality}}`);
      break;
    case "png":
      cliOptions.push("--oxipng", '{"level":3}');
      break;
    case "jxl":
      cliOptions.push("--jxl", `{"quality":${quality}}`);
      break;
    case "wp2":
      cliOptions.push("--wp2", `{"quality":${quality}}`);
      break;
    case "original":
      // No conversion, just copy
      break;
  }

  // Add resize options if needed
  if (resize && (width || height)) {
    const resizeOptions: any = {};

    if (width) resizeOptions.width = width;
    if (height) resizeOptions.height = height;
    if (preserveAspectRatio !== undefined)
      resizeOptions.fitMethod = preserveAspectRatio ? "contain" : "stretch";

    cliOptions.push("--resize", JSON.stringify(resizeOptions));
  }

  return cliOptions;
}

// Optimize image using Squoosh CLI
async function optimizeImage(
  imagePath: string,
  outputPath: string,
  options: SquooshOptions
): Promise<string> {
  // Create the output directory if it doesn't exist
  await fs.ensureDir(path.dirname(outputPath));

  // First, check if the image is already cached
  const cachedPath = checkCache(imagePath, options);

  if (cachedPath) {
    // Copy from cache
    await fs.copy(cachedPath, outputPath);
    return outputPath;
  }

  // If format is 'original', just copy the file
  if (options.format === "original") {
    await fs.copy(imagePath, outputPath);
    return outputPath;
  }

  // Build squoosh command options
  const squooshOptions = buildSquooshOptions(options);

  try {
    // Execute Squoosh CLI
    // Note: In a real implementation, we would use the API directly or spawn a process
    // rather than execSync, but for simplicity we're using execSync here
    const command = [
      "npx",
      "@squoosh/cli",
      ...squooshOptions,
      "--output-dir",
      path.dirname(outputPath),
      "--output-filename",
      path.basename(outputPath, path.extname(outputPath)),
      imagePath,
    ].join(" ");

    execSync(command, { stdio: "inherit" });

    // Cache the result if caching is enabled
    const config = getImageConfig();
    if (config.useCache) {
      const hash = createCacheKey(imagePath, options);
      const ext = getOutputExtension(options.format);
      const cacheFilePath = path.join(
        config.cacheDir,
        `${path.basename(imagePath, path.extname(imagePath))}.${hash}.${ext}`
      );

      await fs.ensureDir(config.cacheDir);
      await fs.copy(outputPath, cacheFilePath);
    }

    return outputPath;
  } catch (error) {
    console.error("Error optimizing image:", error);
    throw error;
  }
}

export { optimizeImage };
