// next-squoosh-plugin.ts
import fs from 'fs';
import path from 'path';
import { cpus } from 'os';
import { promisify } from 'util';
import { Compiler, Compilation } from 'webpack';
import { ImagePool } from '@squoosh/lib';

// Use promisified glob
const glob = promisify(require('glob'));

// Define types for plugin options
export interface NextSquooshPluginOptions {
  patterns: string[];
  outputDir: string;
  formats: Array<'webp' | 'mozjpeg' | 'avif' | 'oxipng'>;
  quality: number;
  excludePatterns: string[];
  replaceOriginal: boolean;
}

// Type for encoder options
interface EncoderOptions {
  [key: string]: {
    [key: string]: number | boolean;
  };
}

export class NextSquooshPlugin {
  private options: NextSquooshPluginOptions;

  constructor(options: Partial<NextSquooshPluginOptions> = {}) {
    // Default options merged with user options
    this.options = {
      patterns: ['**/*.{png,jpg,jpeg}'],
      outputDir: 'public/optimized',
      formats: ['webp', 'mozjpeg'],
      quality: 75, // Default quality level (0-100)
      excludePatterns: ['node_modules/**'],
      replaceOriginal: false,
      ...options,
    };
  }

  apply(compiler: Compiler): void {
    const pluginName = 'NextSquooshPlugin';

    // Hook into the emission phase of compilation
    compiler.hooks.emit.tapAsync(pluginName, async (compilation: Compilation, callback: () => void) => {
      try {
        console.log('\n🖼️ Starting image optimization with Squoosh...');
        await this.optimizeImages(compilation);
        console.log('✅ Image optimization complete!\n');
        callback();
      } catch (error) {
        console.error('❌ Error during image optimization:', error);
        callback();
      }
    });
  }

  async optimizeImages(compilation: Compilation | null): Promise<void> {
    // Find all images matching the pattern
    const allFiles = await glob(this.options.patterns, {
      ignore: this.options.excludePatterns,
      nodir: true,
    });

    if (allFiles.length === 0) {
      console.log('No images found to optimize.');
      return;
    }

    console.log(`Found ${allFiles.length} images to optimize.`);

    // Create output directory if it doesn't exist
    const outputDir = path.resolve(process.cwd(), this.options.outputDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create a pool using all CPU cores
    const imagePool = new ImagePool(cpus().length);

    // Process each image
    const imageProcessingPromises = allFiles.map(async (imagePath: string) => {
      const filename = path.basename(imagePath);
      const outputPath = path.join(outputDir, filename);

      try {
        // Read the image file
        const imageFile = fs.readFileSync(imagePath);
        // Use Squoosh to decode the image
        const image = imagePool.ingestImage(imageFile);

        // Process each requested format
        const encodePromises = this.options.formats.map(async (format) => {
          const encoderOptions = this.getEncoderOptions(format);
          await image.encode(encoderOptions);

          const encodedImage = await image.encodedWith[format];
          if (!encodedImage) {
            throw new Error(`Failed to encode image in ${format} format`);
          }
          const binary = encodedImage.binary;

          // Create output filename with new extension
          const outputFilename = `${path.parse(filename).name}.${this.getExtension(format)}`;
          const formatOutputPath = path.join(outputDir, outputFilename);

          // Write the optimized image
          fs.writeFileSync(formatOutputPath, binary);

          console.log(`Optimized: ${imagePath} → ${formatOutputPath}`);

          // If replaceOriginal is true, update the asset in the compilation
          if (this.options.replaceOriginal && compilation) {
            const assetPath = path.relative(process.cwd(), formatOutputPath);
            // Type assertion to handle webpack 4/5 compatibility
            (compilation.assets as any)[assetPath] = {
              source: () => binary,
              size: () => binary.length,
            };
          }
        });

        await Promise.all(encodePromises);
      } catch (error) {
        console.error(`Failed to optimize ${imagePath}:`, error);
      }
    });

    // Wait for all images to be processed
    await Promise.all(imageProcessingPromises);

    // Close the image pool
    await imagePool.close();
  }

  getEncoderOptions(format: string): EncoderOptions {
    // Configure encoder options based on format and quality
    switch (format) {
      case 'webp':
        return {
          webp: {
            quality: this.options.quality,
          },
        };
      case 'mozjpeg':
        return {
          mozjpeg: {
            quality: this.options.quality,
          },
        };
      case 'avif':
        return {
          avif: {
            cqLevel: Math.round(63 - (this.options.quality / 100 * 63)),
            effort: 4,
          },
        };
      case 'oxipng':
        return {
          oxipng: {
            level: Math.round(this.options.quality / 20), // Convert 0-100 to 0-5
          },
        };
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  getExtension(format: string): string {
    // Return appropriate file extension for each format
    switch (format) {
      case 'webp': return 'webp';
      case 'mozjpeg': return 'jpg';
      case 'avif': return 'avif';
      case 'oxipng': return 'png';
      default: return format;
    }
  }
}
