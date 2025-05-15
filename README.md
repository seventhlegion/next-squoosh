# Passepartout

A React image optimization component similar to `next/image`, providing automatic image optimization, WebP conversion, and responsive loading.

## Features

- 🖼️ Automatic image optimization
- 🔄 WebP conversion
- 📏 Responsive image loading
- 🎯 Lazy loading
- 🎨 Customizable quality settings

## Installation

```bash
pnpm add passepartout
# or
npm install passepartout
# or
yarn add passepartout
```

## Usage

```tsx
import { Image } from "passepartout";

function App() {
  return (
    <Image
      src="/path/to/image.jpg"
      alt="Description"
      width={800}
      height={600}
      quality={80}
    />
  );
}
```

## Props

| Prop    | Type                      | Default  | Description                 |
| ------- | ------------------------- | -------- | --------------------------- |
| src     | string                    | required | The source URL of the image |
| alt     | string                    | required | Alt text for the image      |
| width   | number                    | -        | Desired width of the image  |
| height  | number                    | -        | Desired height of the image |
| quality | number                    | 80       | Image quality (0-100)       |
| format  | 'webp' \| 'jpeg' \| 'png' | 'webp'   | Output format of the image  |

## License

MIT
