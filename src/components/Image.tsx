import { CSSProperties } from "react";
import { ImageProps } from "../types";
import { getImageConfig } from "../utils/config";

const Image = ({
  src,
  alt,
  width,
  height,
  quality,
  format,
  loading = "lazy",
  objectFit,
  objectPosition,
  fill = false,
  sizes,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  onLoadingComplete,
  layout,
  ...rest
}: ImageProps) => {
  const config = getImageConfig();

  // Handle image loading complete
  const handleLoadComplete = (img: HTMLImageElement) => {
    if (onLoadingComplete) {
      onLoadingComplete(img);
    }
  };

  // Determine loading attribute - 'eager' for priority images
  const loadingAttribute = priority ? "eager" : loading;

  // Generate source path for optimized image
  // At build time, the optimizer will replace this with the optimized image path
  const imgSrc =
    typeof src === "string"
      ? `/__squoosh-image__/${encodeURIComponent(src)}?q=${
          quality || config.quality
        }&fmt=${format || config.format}`
      : src;

  // Handle width and height attributes based on fill mode
  const sizeProps = fill
    ? { width: "100%", height: "100%" }
    : { width, height };

  // Setup styles for fill mode
  const imgStyle: CSSProperties = fill
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        boxSizing: "border-box" as const,
        padding: 0,
        border: "none",
        margin: "auto",
        display: "block",
        width: "0",
        height: "0",
        minWidth: "100%",
        maxWidth: "100%",
        minHeight: "100%",
        maxHeight: "100%",
        objectFit: objectFit || "cover",
        objectPosition: objectPosition || "center",
      }
    : {
        objectFit,
        objectPosition,
      };

  // Blur placeholder implementation
  const placeholderStyle: CSSProperties =
    placeholder === "blur" && blurDataURL
      ? {
          backgroundSize: objectFit || "cover",
          backgroundPosition: objectPosition || "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url("${blurDataURL}")`,
        }
      : {};

  const wrapperStyle: CSSProperties = fill
    ? {
        position: "relative",
        width: "100%",
        height: "100%",
      }
    : {};

  // Create image element with all required attributes
   const imgElement = (
    <img
      src={imgSrc}
      alt={alt}
      {...sizeProps}
      loading={loadingAttribute}
      decoding="async"
      style={{ ...imgStyle, ...placeholderStyle }}
      sizes={sizes}
      onLoad={(event) => handleLoadComplete(event.currentTarget)}
      {...rest}
    />
  );

  // For fill mode, wrap in a container
  if (fill) {
    return <div style={wrapperStyle}>{imgElement}</div>;
  }

  // For normal mode, return just the image
  return imgElement;
};

export default { Image };
