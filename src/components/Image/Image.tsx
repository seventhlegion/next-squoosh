import NextImage, { ImageProps } from 'next/image';
import React from 'react';

interface SquooshImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  format?: 'webp' | 'avif';
  quality?: number;
}

export default function Image({ src, format = 'webp', quality = 75, ...props }: SquooshImageProps) {
  const isDev = process.env.NODE_ENV === 'development';

  // Get the original image path and name
  const originalPath = src.startsWith('/') ? src : `/${src}`;
  const pathParts = originalPath.split('/');
  const fileName = pathParts.pop() || '';
  const fileNameWithoutExt = fileName.split('.')[0];

  // In production, use the optimized image path
  const optimizedPath = isDev
    ? originalPath
    : `/optimized/${fileNameWithoutExt}-${format}-q${quality}.${format}`;

  return (
    <NextImage
      {...props}
      src={optimizedPath}
      alt={props.alt || ''}
    />
  );
}
