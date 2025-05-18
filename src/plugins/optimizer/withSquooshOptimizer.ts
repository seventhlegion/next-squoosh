import { ImagePool } from "@squoosh/lib";
import fs from 'fs/promises';
import { NextConfig } from 'next';
import { cpus } from "os";
import path from 'path';

interface SquooshOptimizerOptions {
  sourceDir?: string;
  outputDir?: string;
  formats?: ('webp' | 'avif')[];
  quality?: number;
}

export default function withSquooshOptimizer(
  nextConfig: NextConfig = {},
  options: SquooshOptimizerOptions = {}
) {
  const {
    sourceDir = 'public/assets',
    outputDir = 'public/optimized',
    formats = ['webp'],
    quality = 75
  } = options;

  return {
    ...nextConfig,
    webpack: async (config: any, { isServer }: { isServer: boolean }) => {
      if (isServer) {
        try {
          const imagePool = new ImagePool(cpus().length);

          // Create output directory if it doesn't exist
          await fs.mkdir(outputDir, { recursive: true });

          // Read all files from source directory
          const files = await fs.readdir(sourceDir);

          // Process each image file
          for (const file of files) {
            const filePath = path.join(sourceDir, file);
            const stats = await fs.stat(filePath);

            if (stats.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file)) {
              const imageBuffer = await fs.readFile(filePath);
              const image = imagePool.ingestImage(imageBuffer);

              // Process each format
              for (const format of formats) {
                const optimizedImage = await image.encode({
                  [format]: {
                    quality
                  }
                });

                const result = await image.encode(optimizedImage);
                const optimizedBuffer = result[format].binary;

                // Save optimized image
                const outputFileName = `${path.parse(file).name}-${format}-q${quality}.${format}`;
                await fs.writeFile(path.join(outputDir, outputFileName), optimizedBuffer);
              }
            }
          }

          // Close the image pool
          await imagePool.close();
        } catch (error) {
          console.error('Error optimizing images:', error);
        }
      }

      return config;
    }
  };
}
