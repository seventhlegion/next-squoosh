# Squoosh Image

A React package for image optimization that works similarly to Next.js's `next/image`, but leverages [Squoosh](https://github.com/GoogleChromeLabs/squoosh) for image optimization at build time.

## Features

- 🖼️ Image optimization at build time using Squoosh/cli
- 🚀 Similar API to Next.js's `next/image` component
- 📱 Responsive images with automatic sizing
- 🔍 SEO-friendly with proper alt text and lazy loading
- 🎛️ Configurable quality and format options
- 🛠️ Compatible with popular build tools like webpack

## Installation

```bash
npm install squoosh-image
# or
yarn add squoosh-image
```

Make sure you have the required peer dependencies:

```bash
npm install react react-dom
# or
yarn add react react-dom
```

## Usage

### Basic Usage

```jsx
import Image from 'squoosh-image';

function MyComponent() {
  return (

  );
}
```

### Fill Mode (Similar to next/image)

```jsx
import Image from 'squoosh-image';

function MyComponent() {
  return (



  );
}
```

### With Blur Placeholder

```jsx
import Image from 'squoosh-image';

function MyComponent() {
  return (

  );
}
```

### Priority Loading

```jsx
import Image from 'squoosh-image';

function MyComponent() {
  return (

  );
}
```

## Configuration

You can create a `squoosh-image.config.js` file in your project root to configure the default behavior:

```js
module.exports = {
  // Default quality level (0-100)
  quality: 75,
  // Default output format
  format: 'webp',
  // Paths to scan for images
  imageDirs: ['public', 'src'],
  // Output directory for optimized images
  outputPath: '.squoosh-cache',
  // Whether to generate responsive sizes
  responsive: true,
  // Responsive breakpoints if enabled
  breakpoints: [640, 750, 828, 1080, 1200, 1920],
  // Cache images to avoid reprocessing
  useCache: true,
  // Cache directory
  cacheDir: '.squoosh-cache',
};
```

## Webpack Configuration

To enable build-time optimization, you need to add the webpack loader to your webpack configuration:

```js
// webpack.config.js
const { configureWebpack } = require('squoosh-image');

module.exports = configureWebpack({
  // Your existing webpack config
}, {
  // Optional: Override the default squoosh-image config here
  quality: 80,
  format: 'webp',
});
```

## Babel Configuration

To enable automatic transformation of Image components, add the Babel plugin to your Babel configuration:

```js
// babel.config.js
module.exports = {
  presets: [
    // Your existing presets
  ],
  plugins: [
    // Your existing plugins
    'squoosh-image/babel/plugin'
  ]
};
```

## API Reference

### Image Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | Required | Source path of the image |
| `alt` | string | Required | Alternative text for accessibility |
| `width` | number | undefined | Width of the image in pixels (required unless `fill` is true) |
| `height` | number | undefined | Height of the image in pixels (required unless `fill` is true) |
| `quality` | number | 75 | Quality of the optimized image (0-100) |
| `format` | string | 'webp' | Output format: 'webp', 'avif', 'png', 'mozjpeg', etc. |
| `loading` | string | 'lazy' | Image loading behavior: 'eager' or 'lazy' |
| `objectFit` | string | undefined | CSS object-fit property |
| `objectPosition` | string | undefined | CSS object-position property |
| `fill` | boolean | false | Whether the image should fill its parent container |
| `sizes` | string | undefined | Sizes attribute for responsive images |
| `priority` | boolean | false | Whether to prioritize loading (sets loading="eager") |
| `placeholder` | string | 'empty' | Placeholder type: 'blur' or 'empty' |
| `blurDataURL` | string | undefined | Data URL for blur placeholder |
| `onLoadingComplete` | function | undefined | Callback when image is loaded |

## How It Works

1. At build time, the webpack loader processes image imports and optimizes them using Squoosh.
2. The Babel plugin transforms Image components to use the optimized images.
3. The Image component renders with proper HTML attributes for performance and SEO.

## License

MIT
