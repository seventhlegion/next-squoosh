# Passepartout

A React image optimization component with automatic WebP conversion and compression. Passepartout automatically optimizes your images at build time, converting them to WebP format while maintaining quality and reducing file size.

## Features

- 🖼️ Automatic WebP conversion for all image types (JPG, PNG, GIF)
- 🏗️ Build-time optimization with no runtime overhead
- 📦 Zero client-side JavaScript for image optimization
- 🔄 Automatic fallback to original images
- 📐 Automatic dimension detection
- 🎯 Configurable quality settings
- ⚡ SSR-ready component

## Installation

```bash
npm install next-passepartout
# or
yarn add next-passepartout
# or
pnpm add next-passepartout
```

## Usage

1. Place your images in the `public` directory of your project.

2. Run the optimization script to convert images to WebP:

```bash
npm run optimize-images
```

3. Use the Passepartout component in your React components:

```tsx
import { Passepartout } from "next-passepartout";

function MyComponent() {
  return (
    <Passepartout
      src="/images/example.jpg" // Path relative to public folder
      alt="Description of the image"
      width={800} // Optional: override manifest dimensions
      height={600} // Optional: override manifest dimensions
      quality={80} // Optional: quality setting (default: 80)
      priority={false} // Optional: eager loading (default: false)
      loading="lazy" // Optional: loading strategy (default: "lazy")
    />
  );
}
```

## Props

| Prop          | Type              | Default   | Description                                     |
| ------------- | ----------------- | --------- | ----------------------------------------------- |
| `src`         | string            | required  | Path to the image relative to the public folder |
| `alt`         | string            | required  | Alt text for the image                          |
| `width`       | number            | auto      | Width of the image (optional)                   |
| `height`      | number            | auto      | Height of the image (optional)                  |
| `quality`     | number            | 80        | Quality of the WebP conversion (1-100)          |
| `priority`    | boolean           | false     | Whether to load the image eagerly               |
| `loading`     | "lazy" \| "eager" | "lazy"    | Loading strategy                                |
| `placeholder` | "blur" \| "empty" | "empty"   | Placeholder type                                |
| `blurDataURL` | string            | undefined | Blur placeholder data URL                       |

## Build Process

The build process automatically:

1. Scans your `public` directory for images
2. Converts all images to WebP format
3. Generates a manifest with image metadata
4. Preserves original images for fallback
5. Optimizes images with configurable quality settings

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build the project
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [sevethlegion](https://github.com/seventhlegion)
