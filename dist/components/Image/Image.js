"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
async function Image({ quality = 75, format = 'webp', ...props }) {
    return (react_1.default.createElement("img", { src: props.src, alt: props.alt, width: props.width, height: props.height, loading: props.loading, className: props.className }));
}
exports.default = Image;
//# sourceMappingURL=Image.js.map