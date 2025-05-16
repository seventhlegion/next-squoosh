"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSquooshOptimizer = withSquooshOptimizer;
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const optimizer_1 = require("./optimizer");
function withSquooshOptimizer(nextConfig, options = {}) {
    const { sourceDir = 'public/assets', outputDir = 'public/optimized', formats = ['webp'], quality = 75, } = options;
    return {
        ...nextConfig,
        images: {
            ...(nextConfig.images || {}),
            unoptimized: true,
        },
        webpack(config, ctx) {
            if (!ctx.dev && ctx.isServer) {
                const absSrcDir = path_1.default.resolve(process.cwd(), sourceDir);
                const absOutDir = path_1.default.resolve(process.cwd(), outputDir);
                fs_1.default.mkdirSync(absOutDir, { recursive: true });
                const imageFiles = fast_glob_1.default.sync(`${absSrcDir}/**/*.{jpg,jpeg,png}`);
                for (const file of imageFiles) {
                    const fileName = path_1.default.basename(file).split('.').slice(0, -1).join('-');
                    for (const format of formats) {
                        const outPath = path_1.default.join(absOutDir, `${fileName}-${format}-q${quality}.${format}`);
                        console.log(`🔧 Optimizing ${file} → ${outPath}`);
                        (0, optimizer_1.optimizeImage)(file, absOutDir, format, quality);
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
