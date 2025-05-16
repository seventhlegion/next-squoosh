import { CSSProperties } from "react";

// Format options supported by Squoosh
export type ImageFormat =
  | "mozjpeg"
  | "webp"
  | "avif"
  | "png"
  | "jxl"
  | "wp2"
  | "original";

// Core configuration for the package
export interface SquooshImageConfig {
  // Default quality level (0-100)
  quality: number;
  // Default output format
  format: ImageFormat;
  // Paths to scan for images
  imageDirs: string[];
  // Output directory for optimized images
  outputPath: string;
  // Whether to generate responsive sizes
  responsive: boolean;
  // Responsive breakpoints if enabled
  breakpoints: number[];
  // Cache images to avoid reprocessing
  useCache: boolean;
  // Cache directory
  cacheDir: string;
}

// Props for the Image component
export interface ImageProps {
  // Source of the image (path or URL)
  src: string;
  // Alt text for accessibility
  alt: string;
  // Width in pixels (optional if using fill)
  width?: number;
  // Height in pixels (optional if using fill)
  height?: number;
  // Quality level for optimization (0-100)
  quality?: number;
  // Output format (webp, avif, etc.)
  format?: ImageFormat;
  // Loading behavior (lazy or eager)
  loading?: "lazy" | "eager";
  // Object fit property
  objectFit?: CSSProperties["objectFit"];
  // Object position property
  objectPosition?: CSSProperties["objectPosition"];
  // Fill mode (similar to next/image)
  fill?: boolean;
  // Sizes attribute for responsive images
  sizes?: string;
  // Priority loading (sets loading=eager)
  priority?: boolean;
  // Placeholder behavior while loading
  placeholder?: "blur" | "empty";
  // Data URL for blur placeholder
  blurDataURL?: string;
  // Callback when image is loaded
  onLoadingComplete?: (img: HTMLImageElement) => void;
  // Legacy prop for compatibility with next/image
  layout?: "fill" | "fixed" | "intrinsic" | "responsive";
  // Any other HTML img attributes
  [key: string]: any;
}

// Options for the Squoosh optimizer
export interface SquooshOptions {
  // Output format
  format: ImageFormat;
  // Quality level (0-100)
  quality: number;
  // Whether to resize the image
  resize?: boolean;
  // Target width if resizing
  width?: number;
  // Target height if resizing
  height?: number;
  // Whether to preserve aspect ratio when resizing
  preserveAspectRatio?: boolean;
}
