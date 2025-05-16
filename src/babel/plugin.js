/**
 * A Babel plugin to transform Image components at build time.
 * This replaces dynamic image paths with optimized image paths.
 */
module.exports = function squooshImageBabelPlugin({ types: t }) {
  return {
    name: "squoosh-image-transform",
    visitor: {
      JSXOpeningElement(path, state) {
        // Check if this is our Image component
        if (
          (path.node.name.name === "Image" || path.node.name.name === "img") &&
          path.node.attributes.some(
            (attr) => attr.type === "JSXAttribute" && attr.name.name === "src"
          )
        ) {
          // Find the src attribute
          const srcAttr = path.node.attributes.find(
            (attr) => attr.type === "JSXAttribute" && attr.name.name === "src"
          );

          if (!srcAttr || !srcAttr.value) return;

          // Only process string literals for src
          if (srcAttr.value.type === "StringLiteral") {
            const src = srcAttr.value.value;

            // Skip processing for external URLs or data URIs
            if (
              src.startsWith("http") ||
              src.startsWith("//") ||
              src.startsWith("data:")
            ) {
              return;
            }

            // Find quality and format attributes
            const qualityAttr = path.node.attributes.find(
              (attr) =>
                attr.type === "JSXAttribute" && attr.name.name === "quality"
            );

            const formatAttr = path.node.attributes.find(
              (attr) =>
                attr.type === "JSXAttribute" && attr.name.name === "format"
            );

            // Extract quality and format values
            let quality = null;
            if (qualityAttr && qualityAttr.value) {
              if (qualityAttr.value.type === "NumericLiteral") {
                quality = qualityAttr.value.value;
              } else if (qualityAttr.value.type === "StringLiteral") {
                quality = parseInt(qualityAttr.value.value, 10);
              }
            }

            let format = null;
            if (
              formatAttr &&
              formatAttr.value &&
              formatAttr.value.type === "StringLiteral"
            ) {
              format = formatAttr.value.value;
            }

            // Generate the loader string
            let loaderString = src;
            const query = [];

            if (quality !== null) {
              query.push(`q=${quality}`);
            }

            if (format !== null) {
              query.push(`fmt=${format}`);
            }

            // Add width and height if specified
            const widthAttr = path.node.attributes.find(
              (attr) =>
                attr.type === "JSXAttribute" && attr.name.name === "width"
            );

            const heightAttr = path.node.attributes.find(
              (attr) =>
                attr.type === "JSXAttribute" && attr.name.name === "height"
            );

            if (
              widthAttr &&
              widthAttr.value &&
              widthAttr.value.type === "NumericLiteral"
            ) {
              query.push(`w=${widthAttr.value.value}`);
            }

            if (
              heightAttr &&
              heightAttr.value &&
              heightAttr.value.type === "NumericLiteral"
            ) {
              query.push(`h=${heightAttr.value.value}`);
            }

            // Combine the query parameters
            if (query.length > 0) {
              loaderString = `${src}?${query.join("&")}`;
            }

            // Replace the src attribute with our processed version
            const importIdentifier =
              path.scope.generateUidIdentifier("optimizedImage");

            // Add the import statement for the optimized image
            const program = path.findParent((p) => p.isProgram());
            program.unshiftContainer(
              "body",
              t.importDeclaration(
                [t.importDefaultSpecifier(importIdentifier)],
                t.stringLiteral(loaderString)
              )
            );

            // Replace the string literal with the imported identifier
            srcAttr.value = t.jsxExpressionContainer(importIdentifier);
          }
        }
      },
    },
  };
};
