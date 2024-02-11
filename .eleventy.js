const path = require("path");
const sass = require("sass");
const { minify } = require("terser");
const browserslist = require("browserslist");
const { transform, browserslistToTargets, Features } = require("lightningcss");

module.exports = function (eleventyConfig) {
	// Simple year shortcode
	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
	eleventyConfig.addTemplateFormats("scss");
	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css",
		compile: async function (inputContent, inputPath) {
			// Skip files like _fileName.scss
			let parsed = path.parse(inputPath);
			if (parsed.name.startsWith("_")) {
				return;
			}

			// Run file content through Sass
			let result = sass.compileString(inputContent, {
				loadPaths: [parsed.dir || "."],
				sourceMap: true,
			});

			// Allow included files from @use or @import to
			// trigger rebuilds when using --incremental
			this.addDependencies(inputPath, result.loadedUrls);

			let targets = browserslistToTargets(
				browserslist("> 5% and not dead")
			);

			return async () => {
				let { code } = transform({
					code: Buffer.from(result.css),
					minify: true,
					sourceMap: true,
					targets,
				});
				return code;
			};
		},
	});
	eleventyConfig.addNunjucksAsyncFilter(
		"jsmin",
		async function (code, callback) {
			try {
				const minified = await minify(code);
				callback(null, minified.code);
			} catch (err) {
				console.error("Terser error: ", err);
				// Fail gracefully.
				callback(null, code);
			}
		}
	);

	eleventyConfig.addWatchTarget("./assets/styles");
	eleventyConfig.addPassthroughCopy("./assets/img");
	eleventyConfig.addPassthroughCopy("favicon.svg");
	return {
		templateFormats: ["html", "njk"],
		pathPrefix: "/",
		markdownTemplateEngine: "liquid",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		passthroughFileCopy: true,
		dir: {
			input: ".",
			includes: "_includes",
			data: "_data",
			output: "_site",
		},
	};
};
