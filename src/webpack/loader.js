const path = require("path");
const loaderUtils = require("loader-utils");
const { optimizeImage } = require("../dist/optimizer/squoosh");
const {
  getImageConfig,
  getOptimizedImagePath,
} = require("../dist/utils/config");

/**
 * A webpack loader that optimizes images using Squoosh at build time
 *
 * @param {Buffer} content - The content of the file
 * @returns {String} - The modified JS module
 */
module.exports = async function squooshLoader(content) {
  const callback = this.async();

  // Mark this loader as cacheable
  this.cacheable();

  try {
    // Parse options
    const options = loaderUtils.getOptions(this) || {};
    const config = getImageConfig();

    // Extract query parameters from resource
    const resourceQuery = this.resourceQuery
      ? new URLSearchParams(this.resourceQuery.slice(1))
      : new URLSearchParams();

    // Get optimization settings
    const quality = parseInt(
      resourceQuery.get("q") || options.quality || config.quality,
      10
    );
    const format = resourceQuery.get("fmt") || options.format || config.format;
    const width = resourceQuery.has("w")
      ? parseInt(resourceQuery.get("w"), 10)
      : null;
    const height = resourceQuery.has("h")
      ? parseInt(resourceQuery.get("h"), 10)
      : null;

    // Skip optimization if explicitly disabled
    if (resourceQuery.get("skipOptimization") === "true") {
      return callback(
        null,
        `module.exports = ${JSON.stringify(this.resourcePath)}`
      );
    }

    // Get source image path
    const imagePath = this.resourcePath;

    // Get output path for optimized image
    const outputPath = getOptimizedImagePath(imagePath, { quality, format });
    const outputDir = path.dirname(outputPath);

    // Create optimization options
    const optimizationOptions = {
      format,
      quality,
      resize: !!(width || height),
      width,
      height,
      preserveAspectRatio: true,
    };

    // Perform optimization
    const result = await optimizeImage(
      imagePath,
      outputPath,
      optimizationOptions
    );

    // Get the public path for webpack
    const publicPath = this._compilation.outputOptions.publicPath || "";
    const finalPath = path.join(
      publicPath,
      path.relative(this._compilation.outputPath, result)
    );

    // Return the optimized image URL
    callback(null, `module.exports = ${JSON.stringify(finalPath)}`);
  } catch (error) {
    callback(error);
  }
};
