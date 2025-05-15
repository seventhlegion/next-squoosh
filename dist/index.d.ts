import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
declare const Passepartout: React.FC<ImageProps>;

interface ImageOptimizationOptions {
    quality?: number;
    width?: number;
    height?: number;
    format?: "webp" | "jpeg" | "png";
}
declare function optimizeImage(src: string, options?: ImageOptimizationOptions): Promise<string>;

export { Passepartout as Image, type ImageOptimizationOptions, type ImageProps, optimizeImage };
