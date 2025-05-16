import { execSync } from 'child_process';

export function optimizeImage(
  inputPath: string,
  outputDir: string,
  format: string,
  quality: number
) {
  const cmd = `npx @squoosh/cli --${format} '{quality:${quality}}' -d "${outputDir}" "${inputPath}"`;
  execSync(cmd, { stdio: 'inherit' });
}
