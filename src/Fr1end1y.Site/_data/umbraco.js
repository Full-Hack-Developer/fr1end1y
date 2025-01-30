import env from "./env.js";
import { logError, logInfo } from "../util/logging.js";
import { getContent20 } from "../api/delivery/sdk.gen.js";

// Get the site settings node. The properties of this will be available across
// all templates and layouts as `umbraco.settings`.
async function getSiteSettings() {
	const response = await getContent20({
		query: {
			filter: ["contentType:siteSettings"],
			sort: ["updateDate:desc"],
			take: 1,
		},
	});

	if (response.data.total === 0 || !response.data.items[0]) {
		throw new Error(
			"Site settings node not returned in response from Delivery API.",
		);
	}

	return response.data.items[0].properties;
}

// Get all content from the API, available across all templates and layouts as
// `umbraco.content`.
async function getAllContent() {
	const response = await getContent20({
		query: {
			take: env.umbracoDeliveryAPITake,
		},
	});
	return response.data.items;
}

// The object returned by this function will be exposed in Eleventy templates
// via the `umbraco` variable.
export default async function () {
	try {
		logInfo("Requesting content from the Umbraco delivery API…");

		const siteSettings = await getSiteSettings();
		const content = await getAllContent();

		logInfo(`Number of content nodes retrieved: ${content.length}`);

		// Filter nodes with content type aliases ending with `Page`. These are
		// rendered to HTML output in `../content/UmbracoPage.11ty.js`.
		const pages = content.filter((node) => node.contentType.endsWith("Page"));

		logInfo(`Number of pages: ${pages.length}`);

		return {
			content: content,
			pages: pages,
			settings: siteSettings,
		};
	} catch (error) {
		logError(
			"Failed to create Umbraco global data object. Ensure that the \
Delivery API is running, content is published, and the appropriate environment \
variables are configured.",
		);
		throw error;
	}
}
