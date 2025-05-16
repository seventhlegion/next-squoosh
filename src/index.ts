import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';
import { optimizeImage } from './optimizer';

export interface OptimizerOptions {
  sourceDir?: string;
  outputDir?: string;
  formats?: ('webp' | 'avif')[];
  quality?: number;
}

export function withSquooshOptimizer(nextConfig: any, options: OptimizerOptions = {}) {
  const {
    sourceDir = 'public/assets',
    outputDir = 'public/optimized',
    formats = ['webp'],
    quality = 75,
  } = options;

  return {
    ...nextConfig,
    images: {
      ...(nextConfig.images || {}),
      unoptimized: true,
    },
    webpack(config: any, ctx: any) {
      if (!ctx.dev && ctx.isServer) {
        const absSrcDir = path.resolve(process.cwd(), sourceDir);
        const absOutDir = path.resolve(process.cwd(), outputDir);
        fs.mkdirSync(absOutDir, { recursive: true });

        const imageFiles = glob.sync(`${absSrcDir}/**/*.{jpg,jpeg,png}`);

        // Process images in parallel
        Promise.all(
          imageFiles.flatMap(file =>
            formats.map(format => {
              const fileName = path.basename(file).split('.').slice(0, -1).join('-');
              const outPath = path.join(absOutDir, `${fileName}-${format}-q${quality}.${format}`);
              console.log(`🔧 Optimizing ${file} → ${outPath}`);
              return optimizeImage(file, absOutDir, format, quality);
            })
          )
        ).catch(error => {
          console.error('Error optimizing images:', error);
        });
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, ctx);
      }

      return config;
    },
  };
}
