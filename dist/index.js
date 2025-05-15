'use strict';

var react = require('react');
var child_process = require('child_process');
var promises = require('fs/promises');
var os = require('os');
var path = require('path');
var sharp = require('sharp');
var util = require('util');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var sharp__default = /*#__PURE__*/_interopDefault(sharp);

// src/components/passepartout.tsx
var execAsync = util.promisify(child_process.exec);
async function optimizeImage(src, options = {}) {
  const { quality = 80, format = "webp", width, height } = options;
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `input-${Date.now()}.${format}`);
  const outputPath = path.join(tempDir, `output-${Date.now()}.${format}`);
  try {
    const response = await fetch(src);
    const buffer = await response.arrayBuffer();
    await promises.writeFile(inputPath, Buffer.from(buffer));
    let sharpInstance = sharp__default.default(inputPath);
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true
      });
    }
    const processedBuffer = await sharpInstance.webp({ quality }).toBuffer();
    await promises.writeFile(outputPath, processedBuffer);
    await execAsync(
      `npx @squoosh/cli --mozjpeg '{"quality":${quality}}' ${outputPath}`
    );
    const optimizedBuffer = await promises.readFile(outputPath);
    const base64 = optimizedBuffer.toString("base64");
    const dataUrl = `data:image/${format};base64,${base64}`;
    return dataUrl;
  } finally {
    try {
      await promises.unlink(inputPath);
      await promises.unlink(outputPath);
    } catch (error) {
      console.error("Error cleaning up temporary files:", error);
    }
  }
}
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
  const [optimizedSrc, setOptimizedSrc] = react.useState(src);
  const [isLoading, setIsLoading] = react.useState(true);
  const [error, setError] = react.useState(null);
  react.useEffect(() => {
    const optimize = async () => {
      try {
        setIsLoading(true);
        const optimized = await optimizeImage(src, {
          quality,
          format: "webp",
          width,
          height
        });
        setOptimizedSrc(optimized);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to optimize image")
        );
      } finally {
        setIsLoading(false);
      }
    };
    optimize();
  }, [src, quality, width, height]);
  const imageStyle = {
    ...style,
    opacity: isLoading ? 0.5 : 1,
    transition: "opacity 0.3s ease-in-out"
  };
  if (error) {
    console.error("Image optimization error:", error);
    return /* @__PURE__ */ jsxRuntime.jsx(
      "img",
      {
        src,
        alt,
        width,
        height,
        style,
        className,
        ...props
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "img",
    {
      src: optimizedSrc,
      alt,
      width,
      height,
      loading: priority ? "eager" : loading,
      style: imageStyle,
      className,
      ...props
    }
  );
};

exports.Passepartout = Passepartout;
exports.optimizeImage = optimizeImage;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map