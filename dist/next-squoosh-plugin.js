"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextSquooshPlugin = void 0;
// next-squoosh-plugin.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
const util_1 = require("util");
const lib_1 = require("@squoosh/lib");
// Use promisified glob
const glob = (0, util_1.promisify)(require('glob'));
class NextSquooshPlugin {
    constructor(options = {}) {
        // Default options merged with user options
        this.options = {
            patterns: ['**/*.{png,jpg,jpeg}'],
            outputDir: 'public/optimized',
            formats: ['webp', 'mozjpeg'],
            quality: 75,
            excludePatterns: ['node_modules/**'],
            replaceOriginal: false,
            ...options,
        };
    }
    apply(compiler) {
        const pluginName = 'NextSquooshPlugin';
        // Hook into the emission phase of compilation
        compiler.hooks.emit.tapAsync(pluginName, async (compilation, callback) => {
            try {
                console.log('\n🖼️ Starting image optimization with Squoosh...');
                await this.optimizeImages(compilation);
                console.log('✅ Image optimization complete!\n');
                callback();
            }
            catch (error) {
                console.error('❌ Error during image optimization:', error);
                callback();
            }
        });
    }
    async optimizeImages(compilation) {
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
        const outputDir = path_1.default.resolve(process.cwd(), this.options.outputDir);
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        // Create a pool using all CPU cores
        const imagePool = new lib_1.ImagePool((0, os_1.cpus)().length);
        // Process each image
        const imageProcessingPromises = allFiles.map(async (imagePath) => {
            const filename = path_1.default.basename(imagePath);
            const outputPath = path_1.default.join(outputDir, filename);
            try {
                // Read the image file
                const imageFile = fs_1.default.readFileSync(imagePath);
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
                    const outputFilename = `${path_1.default.parse(filename).name}.${this.getExtension(format)}`;
                    const formatOutputPath = path_1.default.join(outputDir, outputFilename);
                    // Write the optimized image
                    fs_1.default.writeFileSync(formatOutputPath, binary);
                    console.log(`Optimized: ${imagePath} → ${formatOutputPath}`);
                    // If replaceOriginal is true, update the asset in the compilation
                    if (this.options.replaceOriginal && compilation) {
                        const assetPath = path_1.default.relative(process.cwd(), formatOutputPath);
                        // Type assertion to handle webpack 4/5 compatibility
                        compilation.assets[assetPath] = {
                            source: () => binary,
                            size: () => binary.length,
                        };
                    }
                });
                await Promise.all(encodePromises);
            }
            catch (error) {
                console.error(`Failed to optimize ${imagePath}:`, error);
            }
        });
        // Wait for all images to be processed
        await Promise.all(imageProcessingPromises);
        // Close the image pool
        await imagePool.close();
    }
    getEncoderOptions(format) {
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
    getExtension(format) {
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
exports.NextSquooshPlugin = NextSquooshPlugin;
//# sourceMappingURL=next-squoosh-plugin.js.map