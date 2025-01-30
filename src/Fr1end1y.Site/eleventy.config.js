import { IdAttributePlugin } from "@11ty/eleventy";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

import env from "./_data/env.js";
import { client } from "./api/delivery/sdk.gen.js";
import richText from "./filters/richText.js";
import sanitize from "./filters/sanitize.js";
import subpageNavigation from "./filters/subpageNavigation.js";
import htmlMinifier from "./transforms/htmlMinifier.js";
import tableOfContents from "./transforms/tableOfContents.js";

/**
 * @see https://www.11ty.dev/docs/config/
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
export default function (eleventyConfig) {
	// Set the base URL and headers for all Umbraco Delivery API requests using
	// environment variables.
	client.setConfig({
		baseUrl: env.umbracoBaseURL,
		headers: {
			"Accept-Language": env.siteLanguage,
			"Api-Key": env.umbracoDeliveryAPIKey,
		},
		throwOnError: true,
	});

	// Copy the contents of the `public` folder to the output folder
	// https://www.11ty.dev/docs/copy/
	eleventyConfig.addPassthroughCopy({ "./public/": "/" });

	// Add a new CSS bundle for the Eleventy Bundle plugin
	// https://www.11ty.dev/docs/plugins/bundle/
	eleventyConfig.addBundle("css");

	// Add the Id Attribute plugin to add `id` attributes to headings on pages
	// https://www.11ty.dev/docs/plugins/id-attribute/
	eleventyConfig.addPlugin(IdAttributePlugin);

	// Add the Render plugin (used for dynamically rendering templates based on
	// Umbraco content type aliases).
	// https://www.11ty.dev/docs/plugins/render/
	eleventyConfig.addPlugin(EleventyRenderPlugin);

	// Add Image optimization plugin
	// https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ["webp", "jpeg", "svg"],
		svgShortCircuit: true,
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			},
		},
		sharpOptions: {
			animated: true,
		},
		urlPath: "/images/",
	});

	// Add custom filters
	// https://www.11ty.dev/docs/filters/
	eleventyConfig.addFilter("richText", richText);
	eleventyConfig.addFilter("sanitize", sanitize);
	eleventyConfig.addFilter("subpageNavigation", subpageNavigation);

	// Add custom transforms
	// https://www.11ty.dev/docs/transforms/
	eleventyConfig.addTransform("tableOfContents", tableOfContents);
	eleventyConfig.addTransform("htmlMinifier", htmlMinifier);

	// Trigger a build when any file in the uSync directory changes (e.g., when
	// content is published). Handy for local development.
	eleventyConfig.addWatchTarget("../Fr1end1y.Cms/uSync/");

	// Wait a short time before triggering a new build to give Umbraco a chance
	// to index any published content.
	eleventyConfig.setWatchThrottleWaitTime(500);

	return {
		dir: {
			input: "./content/",
			output: "./_site/",
			includes: "../_includes/",
			data: "../_data/",
		},
	};
}
