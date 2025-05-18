# Next.js Squoosh Image Optimizer

A Next.js plugin that optimizes images at build time using [Squoosh](https://github.com/GoogleChromeLabs/squoosh) library.

## Features

- 🖼️ Image optimization at build time using Squoosh
- 🚀 Automatic optimization of images in specified directories
- 📱 Support for multiple output formats (WebP, AVIF)
- 🎛️ Configurable quality and format options
- 🛠️ Seamless integration with Next.js build process

## Installation

```bash
npm install next-squoosh
# or
yarn add next-squoosh
# or
pnpm add next-squoosh
```

## Usage

Add the plugin to your Next.js configuration:

```js
// next.config.js
const { withSquooshOptimizer } = require('next-squoosh');

module.exports = withSquooshOptimizer({
  // Your Next.js config
}, {
  // Optional: Configure the optimizer
  sourceDir: 'public/assets', // Directory containing source images
  outputDir: 'public/optimized', // Directory for optimized images
  formats: ['webp', 'avif'], // Output formats
  quality: 75, // Quality level (0-100)
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sourceDir` | string | 'public/assets' | Directory containing source images to optimize |
| `outputDir` | string | 'public/optimized' | Directory where optimized images will be saved |
| `formats` | string[] | ['webp'] | Array of output formats ('webp', 'avif') |
| `quality` | number | 75 | Quality level for optimization (0-100) |

## How It Works

1. During the Next.js build process, the plugin scans the specified source directory for images
2. Each image is processed using Squoosh to create optimized versions in the specified formats
3. Optimized images are saved to the output directory with format and quality information in the filename
4. The original Next.js image optimization is disabled to prevent double optimization

## Example

Given an image at `public/assets/hero.jpg`, the plugin will create:
- `public/optimized/hero-webp-q75.webp`
- `public/optimized/hero-avif-q75.avif` (if AVIF format is enabled)

## License

MIT
