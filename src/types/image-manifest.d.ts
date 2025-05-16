export interface ImageManifest {
  [key: string]: {
    webp: string;
    width: number;
    height: number;
  };
}

declare module "*/image-manifest.json" {
  const manifest: ImageManifest;
  export default manifest;
}
