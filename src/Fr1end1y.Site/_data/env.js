// Loads environment variables from the `.env` file into `process.env`
// https://github.com/motdotla/dotenv
import "dotenv/config";

import { logError, logWarning } from "../util/logging.js";

// The object exported from this module will be exposed in Eleventy templates
// via the `env` variable. This is merely a thin wrapper around `process.env`.
const env = {
	siteLanguage: process.env.SITE_LANGUAGE,
	umbracoBaseURL: process.env.UMBRACO_BASE_URL,
	umbracoDeliveryAPIKey: process.env.UMBRACO_DELIVERY_API_KEY,
	umbracoDeliveryAPITake: process.env.UMBRACO_DELIVERY_API_TAKE,
};

// Perform some very basic validation to ensure the build has some chance of
// succeeding.
if (!env.umbracoBaseURL) {
	logError("Required environment variable `UMBRACO_BASE_URL` is not set.");
	throw Error();
}

try {
	new URL(env.umbracoBaseURL);
} catch {
	logError("Environment variable `UMBRACO_BASE_URL` is not a valid URL.");
	throw Error();
}

if (!env.siteLanguage) {
	logWarning(
		"Environment variable `SITE_LANGUAGE` is not set. Falling back to `en-US`.",
	);
	env.siteLanguage = "en-US";
}

if (!env.umbracoDeliveryAPITake) {
	logWarning(
		"Environment variable `UMBRACO_DELIVERY_API_TAKE` is not set. Falling back to `1111`.",
	);
	env.umbracoDeliveryAPITake = 1111;
}

export default env;
