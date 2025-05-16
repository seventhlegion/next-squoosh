"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/types/image-manifest.json
var require_image_manifest = __commonJS({
  "src/types/image-manifest.json"(exports2, module2) {
    module2.exports = {
      "": {
        webp: "",
        width: 0,
        height: 0
      }
    };
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Passepartout: () => Passepartout,
  optimizeImage: () => optimizeImage
});
module.exports = __toCommonJS(index_exports);

// src/utils/get-image-manifest.ts
var import_meta = {};
var manifest = {};
async function loadManifest() {
  if (import_meta.env.MODE === "production") {
    try {
      manifest = await Promise.resolve().then(() => __toESM(require_image_manifest())).then(
        (m) => m.default
      );
    } catch (e) {
      console.warn("Missing image-manifest.json");
    }
  }
}
loadManifest();
var get_image_manifest_default = manifest;

// src/components/passepartout.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var import_meta2 = {};
var Passepartout = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  priority = false,
  loading = "lazy",
  placeholder = "empty",
  blurDataURL,
  style,
  className,
  ...props
}) => {
  const manifestEntry = get_image_manifest_default?.[src];
  const optimizedSrc = import_meta2.env.MODE === "production" && manifestEntry?.webp ? manifestEntry.webp : src;
  const finalWidth = width || manifestEntry?.width;
  const finalHeight = height || manifestEntry?.height;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "img",
    {
      src: optimizedSrc,
      alt,
      width: finalWidth,
      height: finalHeight,
      loading: priority ? "eager" : loading,
      style,
      className,
      ...props
    }
  );
};

// src/utils/optimizer.ts
var import_child_process = require("child_process");
var import_promises = require("fs/promises");
var import_os = require("os");
var import_path = require("path");
var import_sharp = __toESM(require("sharp"));
var import_util = require("util");
var execAsync = (0, import_util.promisify)(import_child_process.exec);
async function optimizeImage(src, options = {}) {
  const { quality = 80, format = "webp", width, height } = options;
  const tempDir = (0, import_os.tmpdir)();
  const inputPath = (0, import_path.join)(tempDir, `input-${Date.now()}.${format}`);
  const outputPath = (0, import_path.join)(tempDir, `output-${Date.now()}.${format}`);
  try {
    const response = await fetch(src);
    const buffer = await response.arrayBuffer();
    await (0, import_promises.writeFile)(inputPath, Buffer.from(buffer));
    let sharpInstance = (0, import_sharp.default)(inputPath);
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true
      });
    }
    const processedBuffer = await sharpInstance.webp({ quality }).toBuffer();
    await (0, import_promises.writeFile)(outputPath, processedBuffer);
    await execAsync(
      `npx @squoosh/cli --mozjpeg '{"quality":${quality}}' ${outputPath}`
    );
    const optimizedBuffer = await (0, import_promises.readFile)(outputPath);
    const base64 = optimizedBuffer.toString("base64");
    const dataUrl = `data:image/${format};base64,${base64}`;
    return dataUrl;
  } finally {
    try {
      await (0, import_promises.unlink)(inputPath);
      await (0, import_promises.unlink)(outputPath);
    } catch (error) {
      console.error("Error cleaning up temporary files:", error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Passepartout,
  optimizeImage
});
