import path from 'path';
import { ImageFormat } from '../types';
import { getImageConfig } from '../utils/config';
import { ensureOutputDir, getOptimizedImagePath, getResponsiveSizes, resolveImagePath } from '../utils/path';
import { optimizeImage } from './squoosh';

/**
 * Optimizes an image with the given options
 *
 * @param src - The source path of the image
 * @param options - Optimization options
 * @returns The path to the optimized image
 */
export async function optimize(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: ImageFormat;
    generateResponsive?: boolean;
  } = {}
): Promise<string | { src: string; srcSet: string; sizes: string }> {
  // Resolve the absolute path to the source image
  const imagePath = resolveImagePath(src);

  // Get configuration
  const config = getImageConfig();
  const quality = options.quality ?? config.quality;
  const format = options.format ?? config.format;

  // Ensure output directory exists
  await ensureOutputDir();

  // If responsive images are requested, generate multiple sizes
  if ((options.generateResponsive ?? config.responsive) && options.width && options.height) {
    const responsiveSizes = getResponsiveSizes(options.width, options.height);

    // Create an array of promises for optimizing each responsive size
    const optimizationPromises = responsiveSizes.map(async size => {
      const outputPath = getOptimizedImagePath(src, {
        width: size.width,
        height: size.height,
        quality,
        format
      });

      // Optimize the image for this size
      await optimizeImage(imagePath, outputPath, {
        format,
        quality,
        resize: true,
        width: size.width,
        height: size.height,
        preserveAspectRatio: true
      });

      return {
        width: size.width,
        path: outputPath
      };
    });

    // Wait for all optimizations to complete
    const optimizedImages = await Promise.all(optimizationPromises);

    // Also optimize the original size
    const outputPath = getOptimizedImagePath(src, { width: options.width, height: options.height, quality, format });
    await optimizeImage(imagePath, outputPath, {
      format,
      quality,
      resize: true,
      width: options.width,
      height: options.height,
      preserveAspectRatio: true
    });

    // Generate srcSet attribute
    const srcSet = optimizedImages
      .map(img => `${path.relative(process.cwd(), img.path)} ${img.width}w`)
      .join(', ');

    // Generate sizes attribute (default if not provided)
    const sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

    return {
      src: path.relative(process.cwd(), outputPath),
      srcSet,
      sizes
    };
  }

  // For non-responsive images, just optimize once
  const outputPath = getOptimizedImagePath(src, { width: options.width, height: options.height, quality, format });

  await optimizeImage(imagePath, outputPath, {
    format,
    quality,
    resize: !!(options.width || options.height),
    width: options.width,
    height: options.height,
    preserveAspectRatio: true
  });

  return path.relative(process.cwd(), outputPath);
}

/**
 * Gets metadata about an image
 *
 * @param src - The source path of the image
 * @returns Image metadata including dimensions
 */
export async function getImageMetadata(src: string): Promise<{ width: number; height: number; format: string }> {
  // In a real implementation, we would use an image processing library to get metadata
  // For this example, we'll just return mock data
  return {
    width: 1200,
    height: 800,
    format: path.extname(src).substring(1)
  };
}

/**
 * Creates a blur data URL for an image
 *
 * @param src - The source path of the image
 * @returns A base64 data URL of a blurred tiny version of the image
 */
export async function createBlurDataURL(src: string): Promise<string> {
  const imagePath = resolveImagePath(src);
  const outputPath = getOptimizedImagePath(src, { width: 10, height: 10, quality: 20, format: 'webp' });

  // Create a tiny version of the image
  await optimizeImage(imagePath, outputPath, {
    format: 'webp',
    quality: 20,
    resize: true,
    width: 10,
    height: 10,
    preserveAspectRatio: true
  });

  // In a real implementation, we would convert the image to a data URL
  // For this example, we'll just return a mock data URL
  return 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAQABUB8JaQAA3AA/vA6WAAAAA==';
}
