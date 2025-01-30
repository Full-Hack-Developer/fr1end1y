// An Eleventy JavaScript template used to render Umbraco content pages
// https://www.11ty.dev/docs/languages/javascript/#classes
class UmbracoPage {
	data() {
		return {
			// Use Eleventy's Pagination feature to render this template for every
			// item in the `umbraco.pages` array (which was populated in
			// `../_data/umbraco.js`) and expose the current page in templates via
			// a variable named `currentPage`.
			// https://www.11ty.dev/docs/pages-from-data/
			pagination: {
				data: "umbraco.pages",
				size: 1,
				alias: "currentPage",
			},

			// Set the base layout for all pages
			// https://www.11ty.dev/docs/layouts/
			layout: "layouts/base.njk",

			// Set the Eleventy permalink to mirror the Umbraco node URL
			// https://www.11ty.dev/docs/permalinks/
			permalink: ({ currentPage }) => currentPage.route.path,
		};
	}

	async render(data) {
		// Render the Nunjucks template with the same name as the content type of
		// the currently rendering page.
		return await this.renderFile(
			`_includes/pages/${data.currentPage.contentType}.njk`,
			data,
		);
	}
}

export default UmbracoPage;
