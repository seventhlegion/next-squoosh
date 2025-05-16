"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeImage = optimizeImage;
const child_process_1 = require("child_process");
function optimizeImage(inputPath, outputDir, format, quality) {
    const cmd = `npx @squoosh/cli --${format} '{quality:${quality}}' -d "${outputDir}" "${inputPath}"`;
    (0, child_process_1.execSync)(cmd, { stdio: 'inherit' });
}
