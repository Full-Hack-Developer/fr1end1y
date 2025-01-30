import { minify } from "html-minifier-terser";

// Minify HTML and CSS output
// https://www.11ty.dev/docs/transforms/#minify-html-output
export default function (content) {
	// Ensure we only deal with HTML pages
	if (!(this.page.outputPath || "").endsWith(".html")) {
		return content;
	}

	return minify(content, {
		collapseBooleanAttributes: true,
		collapseWhitespace: true,
		minifyCSS: true,
		removeAttributeQuotes: true,
		removeOptionalTags: true,
		removeRedundantAttributes: true,
		sortAttributes: true,
		sortClassName: true,
	});
}
