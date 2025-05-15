'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

// src/components/image.tsx

// src/utils/optimizer.ts
async function optimizeImage(src, options = {}) {
  try {
    const { quality = 80, width, height, format = "webp" } = options;
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
    canvas.width = width || img.width;
    canvas.height = height || img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const webpDataUrl = canvas.toDataURL(`image/${format}`, quality / 100);
    return webpDataUrl;
  } catch (error) {
    console.error("Error optimizing image:", error);
    return src;
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
var image_default = Passepartout;

exports.Image = image_default;
exports.optimizeImage = optimizeImage;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map