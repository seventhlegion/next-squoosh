export interface OptimizerOptions {
    sourceDir?: string;
    outputDir?: string;
    formats?: ('webp' | 'avif')[];
    quality?: number;
}
export declare function withSquooshOptimizer(nextConfig: any, options?: OptimizerOptions): any;
