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

        for (const file of imageFiles) {
          const fileName = path.basename(file).split('.').slice(0, -1).join('-');

          for (const format of formats) {
            const outPath = path.join(absOutDir, `${fileName}-${format}-q${quality}.${format}`);
            console.log(`🔧 Optimizing ${file} → ${outPath}`);
            optimizeImage(file, absOutDir, format, quality);
          }
        }
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, ctx);
      }

      return config;
    },
  };
}
