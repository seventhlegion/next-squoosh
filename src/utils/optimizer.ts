import { exec } from "child_process";
import { readFile, unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import sharp from "sharp";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface OptimizeOptions {
  quality?: number;
  format?: "webp" | "jpeg" | "png";
  width?: number;
  height?: number;
}

export async function optimizeImage(
  src: string,
  options: OptimizeOptions = {}
): Promise<string> {
  const { quality = 80, format = "webp", width, height } = options;

  // Create temporary files
  const tempDir = tmpdir();
  const inputPath = join(tempDir, `input-${Date.now()}.${format}`);
  const outputPath = join(tempDir, `output-${Date.now()}.${format}`);

  try {
    // Download and save the image
    const response = await fetch(src);
    const buffer = await response.arrayBuffer();
    await writeFile(inputPath, Buffer.from(buffer));

    // Process with Sharp first for resizing
    let sharpInstance = sharp(inputPath);

    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Convert to WebP with quality settings
    const processedBuffer = await sharpInstance.webp({ quality }).toBuffer();

    await writeFile(outputPath, processedBuffer);

    // Use Squoosh for additional optimization
    await execAsync(
      `npx @squoosh/cli --mozjpeg '{"quality":${quality}}' ${outputPath}`
    );

    // Read the optimized file
    const optimizedBuffer = await readFile(outputPath);
    const base64 = optimizedBuffer.toString("base64");
    const dataUrl = `data:image/${format};base64,${base64}`;

    return dataUrl;
  } finally {
    // Clean up temporary files
    try {
      await unlink(inputPath);
      await unlink(outputPath);
    } catch (error) {
      console.error("Error cleaning up temporary files:", error);
    }
  }
}
