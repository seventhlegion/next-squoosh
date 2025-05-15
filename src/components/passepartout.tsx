import React, { useEffect, useState } from "react";
import { optimizeImage } from "../utils/optimizer";

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

const Passepartout: React.FC<PassepartoutProps> = ({
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
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const optimize = async () => {
      try {
        setIsLoading(true);
        const optimized = await optimizeImage(src, {
          quality,
          format: "webp",
          width,
          height,
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

  const imageStyle: React.CSSProperties = {
    ...style,
    opacity: isLoading ? 0.5 : 1,
    transition: "opacity 0.3s ease-in-out",
  };

  if (error) {
    console.error("Image optimization error:", error);
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        className={className}
        {...props}
      />
    );
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : loading}
      style={imageStyle}
      className={className}
      {...props}
    />
  );
};

export default Passepartout;
