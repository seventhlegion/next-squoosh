import { Compiler, Compilation } from 'webpack';
export interface NextSquooshPluginOptions {
    patterns: string[];
    outputDir: string;
    formats: Array<'webp' | 'mozjpeg' | 'avif' | 'oxipng'>;
    quality: number;
    excludePatterns: string[];
    replaceOriginal: boolean;
}
interface EncoderOptions {
    [key: string]: {
        [key: string]: number | boolean;
    };
}
export declare class NextSquooshPlugin {
    private options;
    constructor(options?: Partial<NextSquooshPluginOptions>);
    apply(compiler: Compiler): void;
    optimizeImages(compilation: Compilation | null): Promise<void>;
    getEncoderOptions(format: string): EncoderOptions;
    getExtension(format: string): string;
}
export {};
