import { ImageProps } from 'next/image';
import React from 'react';
interface SquooshImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    format?: 'webp' | 'avif';
    quality?: number;
}
export default function Image({ src, format, quality, ...props }: SquooshImageProps): React.JSX.Element;
export {};
