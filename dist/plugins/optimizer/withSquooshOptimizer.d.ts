import { NextConfig } from 'next';
interface SquooshOptimizerOptions {
    sourceDir?: string;
    outputDir?: string;
    formats?: ('webp' | 'avif')[];
    quality?: number;
}
export default function withSquooshOptimizer(nextConfig?: NextConfig, options?: SquooshOptimizerOptions): {
    webpack: (config: any, { isServer }: {
        isServer: boolean;
    }) => Promise<any>;
    allowedDevOrigins?: string[] | undefined;
    exportPathMap?: ((defaultMap: import("next/dist/server/config-shared").ExportPathMap, ctx: {
        dev: boolean;
        dir: string;
        outDir: string | null;
        distDir: string;
        buildId: string;
    }) => import("next/dist/server/config-shared").ExportPathMap | Promise<import("next/dist/server/config-shared").ExportPathMap>) | undefined;
    i18n?: import("next/dist/server/config-shared").I18NConfig | null | undefined;
    eslint?: import("next/dist/server/config-shared").ESLintConfig | undefined;
    typescript?: import("next/dist/server/config-shared").TypeScriptConfig | undefined;
    headers?: (() => Promise<import("next/dist/lib/load-custom-routes").Header[]>) | undefined;
    rewrites?: (() => Promise<import("next/dist/lib/load-custom-routes").Rewrite[] | {
        beforeFiles?: import("next/dist/lib/load-custom-routes").Rewrite[] | undefined;
        afterFiles?: import("next/dist/lib/load-custom-routes").Rewrite[] | undefined;
        fallback?: import("next/dist/lib/load-custom-routes").Rewrite[] | undefined;
    }>) | undefined;
    redirects?: (() => Promise<import("next/dist/lib/load-custom-routes").Redirect[]>) | undefined;
    excludeDefaultMomentLocales?: boolean | undefined;
    trailingSlash?: boolean | undefined;
    env?: Record<string, string | undefined> | undefined;
    distDir?: string | undefined;
    cleanDistDir?: boolean | undefined;
    assetPrefix?: string | undefined;
    cacheHandler?: string | undefined;
    cacheMaxMemorySize?: number | undefined;
    useFileSystemPublicRoutes?: boolean | undefined;
    generateBuildId?: (() => string | Promise<string | null> | null) | undefined;
    generateEtags?: boolean | undefined;
    pageExtensions?: string[] | undefined;
    compress?: boolean | undefined;
    poweredByHeader?: boolean | undefined;
    images?: Partial<import("next/dist/shared/lib/image-config").ImageConfigComplete> | undefined;
    devIndicators?: false | {
        appIsrStatus?: boolean | undefined;
        buildActivity?: boolean | undefined;
        buildActivityPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | undefined;
        position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | undefined;
    } | undefined;
    onDemandEntries?: {
        maxInactiveAge?: number | undefined;
        pagesBufferLength?: number | undefined;
    } | undefined;
    amp?: {
        canonicalBase?: string | undefined;
    } | undefined;
    deploymentId?: string | undefined;
    basePath?: string | undefined;
    sassOptions?: {
        [key: string]: any;
        implementation?: string | undefined;
    } | undefined;
    productionBrowserSourceMaps?: boolean | undefined;
    reactProductionProfiling?: boolean | undefined;
    reactStrictMode?: boolean | null | undefined;
    reactMaxHeadersLength?: number | undefined;
    publicRuntimeConfig?: {
        [key: string]: any;
    } | undefined;
    serverRuntimeConfig?: {
        [key: string]: any;
    } | undefined;
    httpAgentOptions?: {
        keepAlive?: boolean | undefined;
    } | undefined;
    staticPageGenerationTimeout?: number | undefined;
    crossOrigin?: "anonymous" | "use-credentials" | undefined;
    compiler?: {
        reactRemoveProperties?: boolean | {
            properties?: string[] | undefined;
        } | undefined;
        relay?: {
            src: string;
            artifactDirectory?: string | undefined;
            language?: "typescript" | "javascript" | "flow" | undefined;
            eagerEsModules?: boolean | undefined;
        } | undefined;
        removeConsole?: boolean | {
            exclude?: string[] | undefined;
        } | undefined;
        styledComponents?: boolean | import("next/dist/server/config-shared").StyledComponentsConfig | undefined;
        emotion?: boolean | import("next/dist/server/config-shared").EmotionConfig | undefined;
        styledJsx?: boolean | {
            useLightningcss?: boolean | undefined;
        } | undefined;
        define?: Record<string, string> | undefined;
    } | undefined;
    output?: "standalone" | "export" | undefined;
    transpilePackages?: string[] | undefined;
    turbopack?: import("next/dist/server/config-shared").TurbopackOptions | undefined;
    skipMiddlewareUrlNormalize?: boolean | undefined;
    skipTrailingSlashRedirect?: boolean | undefined;
    modularizeImports?: Record<string, {
        transform: string | Record<string, string>;
        preventFullImport?: boolean | undefined;
        skipDefaultConversion?: boolean | undefined;
    }> | undefined;
    logging?: false | import("next/dist/server/config-shared").LoggingConfig | undefined;
    expireTime?: number | undefined;
    experimental?: import("next/dist/server/config-shared").ExperimentalConfig | undefined;
    bundlePagesRouterDependencies?: boolean | undefined;
    serverExternalPackages?: string[] | undefined;
    outputFileTracingRoot?: string | undefined;
    outputFileTracingExcludes?: Record<string, string[]> | undefined;
    outputFileTracingIncludes?: Record<string, string[]> | undefined;
    watchOptions?: {
        pollIntervalMs?: number | undefined;
    } | undefined;
    htmlLimitedBots?: RegExp | undefined;
};
export {};
