"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("@squoosh/lib");
const promises_1 = __importDefault(require("fs/promises"));
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
function withSquooshOptimizer(nextConfig = {}, options = {}) {
    const { sourceDir = 'public/assets', outputDir = 'public/optimized', formats = ['webp'], quality = 75 } = options;
    return {
        ...nextConfig,
        webpack: async (config, { isServer }) => {
            if (isServer) {
                try {
                    const imagePool = new lib_1.ImagePool((0, os_1.cpus)().length);
                    // Create output directory if it doesn't exist
                    await promises_1.default.mkdir(outputDir, { recursive: true });
                    // Read all files from source directory
                    const files = await promises_1.default.readdir(sourceDir);
                    // Process each image file
                    for (const file of files) {
                        const filePath = path_1.default.join(sourceDir, file);
                        const stats = await promises_1.default.stat(filePath);
                        if (stats.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file)) {
                            const imageBuffer = await promises_1.default.readFile(filePath);
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
                                const outputFileName = `${path_1.default.parse(file).name}-${format}-q${quality}.${format}`;
                                await promises_1.default.writeFile(path_1.default.join(outputDir, outputFileName), optimizedBuffer);
                            }
                        }
                    }
                    // Close the image pool
                    await imagePool.close();
                }
                catch (error) {
                    console.error('Error optimizing images:', error);
                }
            }
            return config;
        }
    };
}
exports.default = withSquooshOptimizer;
//# sourceMappingURL=withSquooshOptimizer.js.map