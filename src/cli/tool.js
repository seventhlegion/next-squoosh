#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");
const yargs = require("yargs");
const { optimize } = require("../dist/optimizer");
const { getImageConfig } = require("../dist/utils/config");

// Parse command line arguments
const argv = yargs
  .usage("Usage: $0 [options] <glob-pattern>")
  .option("quality", {
    alias: "q",
    describe: "Quality level (0-100)",
    type: "number",
  })
  .option("format", {
    alias: "f",
    describe: "Output format (webp, avif, png, etc.)",
    type: "string",
  })
  .option("width", {
    alias: "w",
    describe: "Target width",
    type: "number",
  })
  .option("height", {
    alias: "h",
    describe: "Target height",
    type: "number",
  })
  .option("output", {
    alias: "o",
    describe: "Output directory",
    type: "string",
  })
  .option("responsive", {
    alias: "r",
    describe: "Generate responsive sizes",
    type: "boolean",
  })
  .help().argv;

// Get the glob pattern from positional arguments or default to all images
const pattern = argv._[0] || "**/*.{jpg,jpeg,png,gif,webp,avif,svg}";

// Get config with any CLI overrides
const config = {
  ...getImageConfig(),
  quality: argv.quality,
  format: argv.format,
  outputPath: argv.output,
  responsive: argv.responsive,
};

// Log the configuration
console.log("Optimizing images with the following configuration:");
console.log(JSON.stringify(config, null, 2));

// Find all matching images
glob(
  pattern,
  { ignore: ["node_modules/**", config.outputPath + "/**"] },
  async (err, files) => {
    if (err) {
      console.error("Error finding files:", err);
      process.exit(1);
    }

    console.log(`Found ${files.length} images to optimize`);

    // Process each file
    for (const file of files) {
      try {
        console.log(`Processing ${file}...`);

        // Extract dimensions from filename if not provided
        // Example: image-800x600.jpg -> width=800, height=600
        let width = argv.width;
        let height = argv.height;

        if (!width || !height) {
          const match = path.basename(file).match(/(\d+)x(\d+)/);
          if (match) {
            width = parseInt(match[1], 10);
            height = parseInt(match[2], 10);
          }
        }

        // Optimize the image
        const result = await optimize(file, {
          width,
          height,
          quality: config.quality,
          format: config.format,
          generateResponsive: config.responsive,
        });

        // Log the result
        if (typeof result === "string") {
          console.log(`✓ Optimized to: ${result}`);
        } else {
          console.log(`✓ Optimized to: ${result.src}`);
          console.log(
            `  Generated srcSet with ${
              result.srcSet.split(",").length
            } variants`
          );
        }
      } catch (error) {
        console.error(`Error optimizing ${file}:`, error);
      }
    }

    console.log("Optimization complete!");
  }
);
