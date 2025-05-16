import React from "react";
import imageManifest from "../utils/get-image-manifest";

export interface PassepartoutProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export const Passepartout: React.FC<PassepartoutProps> = ({
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
  // Get the optimized WebP version from the manifest
  const manifestEntry = imageManifest?.[src];
  const optimizedSrc =
    import.meta.env.MODE === "production" && manifestEntry?.webp
      ? manifestEntry.webp
      : src;

  // Use dimensions from manifest if not explicitly provided
  const finalWidth = width || manifestEntry?.width;
  const finalHeight = height || manifestEntry?.height;

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      loading={priority ? "eager" : loading}
      style={style}
      className={className}
      {...props}
    />
  );
};

export default Passepartout;
