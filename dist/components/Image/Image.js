"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = __importDefault(require("next/image"));
const react_1 = __importDefault(require("react"));
function Image({ src, format = 'webp', quality = 75, ...props }) {
    const isDev = process.env.NODE_ENV === 'development';
    // Get the original image path and name
    const originalPath = src.startsWith('/') ? src : `/${src}`;
    const pathParts = originalPath.split('/');
    const fileName = pathParts.pop() || '';
    const fileNameWithoutExt = fileName.split('.')[0];
    // In production, use the optimized image path
    const optimizedPath = isDev
        ? originalPath
        : `/optimized/${fileNameWithoutExt}-${format}-q${quality}.${format}`;
    return (react_1.default.createElement(image_1.default, { ...props, src: optimizedPath, alt: props.alt || '' }));
}
exports.default = Image;
//# sourceMappingURL=Image.js.map