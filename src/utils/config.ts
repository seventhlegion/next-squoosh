import fs from "fs";
import path from "path";
import { SquooshImageConfig } from "../types";

// Default configuration
const defaultConfig: SquooshImageConfig = {
  quality: 75,
  format: "webp",
  imageDirs: ["public", "src"],
  outputPath: ".squoosh-cache",
  responsive: true,
  breakpoints: [640, 750, 828, 1080, 1200, 1920],
  useCache: true,
  cacheDir: ".squoosh-cache",
};

// Try to load user configuration from squoosh-image.config.js
function loadUserConfig(): Partial<SquooshImageConfig> {
  try {
    const appDirectory = process.cwd();
    const configPath = path.join(appDirectory, "squoosh-image.config.js");

    if (fs.existsSync(configPath)) {
      // Using require to load the config file
      const userConfig = require(configPath);
      return userConfig;
    }
  } catch (error) {
    console.warn(
      "Failed to load squoosh-image.config.js, using default config:",
      error
    );
  }

  return {};
}

// Merge default config with user config
export function getImageConfig(): SquooshImageConfig {
  const userConfig = loadUserConfig();

  return {
    ...defaultConfig,
    ...userConfig,
  };
}

// Get the path for an optimized image
export function getOptimizedImagePath(
  src: string,
  options: { quality?: number; format?: string }
): string {
  const config = getImageConfig();
  const quality = options.quality || config.quality;
  const format = options.format || config.format;

  // Create a deterministic hash for the image path and options
  // This would be improved in a real implementation
  const hash = Buffer.from(`${src}:${quality}:${format}`)
    .toString("base64")
    .replace(/\//g, "_")
    .replace(/\+/g, "-")
    .replace(/=/g, "");

  const ext = format === "original" ? path.extname(src).substring(1) : format;
  const filename = `${path.basename(src, path.extname(src))}.${hash}.${ext}`;

  return path.join(config.outputPath, filename);
}
