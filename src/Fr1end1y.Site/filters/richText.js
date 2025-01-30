import posthtml from "posthtml";
import urls from "@11ty/posthtml-urls";

import env from "../_data/env.js";

// Process richtext editor markup returned from the CMS. Ensures that media
// URLs are prefixed with the Umbraco base URL (media is subsequently
// downloaded by the Eleventy Image plugin).
export default async function (markup) {
	const options = {
		eachURL: (url) => {
			if (url.startsWith("/media/")) {
				const absoluteUrl = new URL(url, env.umbracoBaseURL);
				return absoluteUrl.href;
			}

			return url;
		},
	};

	const result = await posthtml().use(urls(options)).process(markup);
	return result.html;
}
