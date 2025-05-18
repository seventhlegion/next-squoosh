import React from 'react';
export type ImageFormat = 'webp' | 'avif' | 'mozjpeg' | 'png' | 'wp2';
export type ImageProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
    quality?: number;
    format?: ImageFormat;
    placeholder?: 'blur' | 'empty';
    loading?: 'lazy' | 'eager';
    className?: string;
} & React.HTMLAttributes<HTMLImageElement>;
export default function Image({ quality, format, ...props }: ImageProps): Promise<React.JSX.Element>;
