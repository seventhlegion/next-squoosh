import path from "path";
import { SquooshImageConfig } from "../types";

/**
 * Configuration for Next.js integration
 */
export interface NextJsConfig {
  // Next.js webpack config
  nextConfig: any;
  // Custom squoosh-image options
  squooshOptions?: Partial<SquooshImageConfig>;
}

/**
 * Integrates squoosh-image with Next.js
 *
 * @param config - Next.js configuration and squoosh options
 * @returns Modified Next.js configuration
 */
export function withSquooshImage(config: NextJsConfig): any {
  const { nextConfig, squooshOptions } = config;

  return {
    ...nextConfig,
    webpack: (webpackConfig: any, options: any) => {
      // Add the webpack loader for image files
      webpackConfig.module.rules.push({
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        issuer: { not: /\.(css|scss|sass)$/ }, // Don't process images imported in CSS
        use: [
          {
            loader: path.resolve(__dirname, "../../webpack/loader.js"),
            options: squooshOptions || {},
          },
        ],
      });

      // Run the user's webpack function if provided
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(webpackConfig, options);
      }

      return webpackConfig;
    },

    // Add babel plugin to process Image components
    babel: {
      ...(nextConfig.babel || {}),
      plugins: [
        ...(nextConfig.babel?.plugins || []),
        path.resolve(__dirname, "../../babel/plugin.js"),
      ],
    },
  };
}

/**
 * Provides a Next.js API route handler for dynamic image optimization
 * This is for cases where build-time optimization isn't enough
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
export async function imageOptimizationHandler(
  req: any,
  res: any
): Promise<void> {
  const { optimize } = await import("../optimizer");

  try {
    // Extract parameters from the request
    const src = req.query.src as string;
    const width = req.query.w ? parseInt(req.query.w as string, 10) : undefined;
    const height = req.query.h
      ? parseInt(req.query.h as string, 10)
      : undefined;
    const quality = req.query.q
      ? parseInt(req.query.q as string, 10)
      : undefined;
    const format = req.query.fmt as string;

    if (!src) {
      res.status(400).json({ error: "Missing src parameter" });
      return;
    }

    // Optimize the image
    const result = await optimize(src, {
      width,
      height,
      quality,
      format: format as any,
      generateResponsive: false,
    });

    // The optimize function returns either a string or an object
    const imagePath = typeof result === "string" ? result : result.src;

    // Set appropriate headers
    res.setHeader("Content-Type", `image/${format || "webp"}`);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    // Send the optimized image
    const fs = await import("fs-extra");
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);
  } catch (error) {
    console.error("Error optimizing image:", error);
    res.status(500).json({ error: "Failed to optimize image" });
  }
}
