import React from 'react';

interface PassepartoutProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
declare const Passepartout: React.FC<PassepartoutProps>;

interface OptimizeOptions {
    quality?: number;
    format?: "webp" | "jpeg" | "png";
    width?: number;
    height?: number;
}
declare function optimizeImage(src: string, options?: OptimizeOptions): Promise<string>;

export { Passepartout, type PassepartoutProps, optimizeImage };
