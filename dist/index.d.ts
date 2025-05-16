import * as react_jsx_runtime from 'react/jsx-runtime';
import { CSSProperties } from 'react';

type ImageFormat = "mozjpeg" | "webp" | "avif" | "png" | "jxl" | "wp2" | "original";
interface SquooshImageConfig {
    quality: number;
    format: ImageFormat;
    imageDirs: string[];
    outputPath: string;
    responsive: boolean;
    breakpoints: number[];
    useCache: boolean;
    cacheDir: string;
}
interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    quality?: number;
    format?: ImageFormat;
    loading?: "lazy" | "eager";
    objectFit?: CSSProperties["objectFit"];
    objectPosition?: CSSProperties["objectPosition"];
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    placeholder?: "blur" | "empty";
    blurDataURL?: string;
    onLoadingComplete?: (img: HTMLImageElement) => void;
    layout?: "fill" | "fixed" | "intrinsic" | "responsive";
    [key: string]: any;
}

declare const _default: {
    Image: ({ src, alt, width, height, quality, format, loading, objectFit, objectPosition, fill, sizes, priority, placeholder, blurDataURL, onLoadingComplete, layout, ...rest }: ImageProps) => react_jsx_runtime.JSX.Element;
};

/**
 * Configuration for Next.js integration
 */
interface NextJsConfig {
    nextConfig: any;
    squooshOptions?: Partial<SquooshImageConfig>;
}
/**
 * Integrates squoosh-image with Next.js
 *
 * @param config - Next.js configuration and squoosh options
 * @returns Modified Next.js configuration
 */
declare function withSquooshImage(config: NextJsConfig): any;
/**
 * Provides a Next.js API route handler for dynamic image optimization
 * This is for cases where build-time optimization isn't enough
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
declare function imageOptimizationHandler(req: any, res: any): Promise<void>;

export { _default as Image, type ImageProps, type NextJsConfig, imageOptimizationHandler, withSquooshImage };
