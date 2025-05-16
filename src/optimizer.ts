import { ImagePool } from '@squoosh/lib';
import fs from 'fs';
import { cpus } from 'os';
import path from 'path';

export async function optimizeImage(
  inputPath: string,
  outputDir: string,
  format: string,
  quality: number
) {
  const imagePool = new ImagePool(cpus().length);
  const image = imagePool.ingestImage(fs.readFileSync(inputPath));

  const preprocessOptions = {
    resize: undefined
  };

  const encodeOptions = {
    [format]: {
      quality: quality
    }
  };

  await image.decoded;
  await image.preprocess(preprocessOptions);
  await image.encode(encodeOptions);

  const rawEncodedImage = await image.encodedWith[format as keyof typeof image.encodedWith];
  const fileName = `${path.basename(inputPath).split('.')[0]}-${format}-q${quality}.${format}`;
  const outputPath = path.join(outputDir, fileName);

  if (rawEncodedImage) {
    fs.writeFileSync(outputPath, rawEncodedImage.binary);
  }

  await imagePool.close();
}
