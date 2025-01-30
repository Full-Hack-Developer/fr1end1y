import env from "./_data/env.js";

/**
 * @see https://heyapi.dev/openapi-ts/configuration.html
 * @type {import("@hey-api/openapi-ts").UserConfig}
 */
export default {
	client: "@hey-api/client-fetch",
	input: new URL("/umbraco/swagger/delivery/swagger.json", env.umbracoBaseURL)
		.href,
	output: "api/delivery",
};
