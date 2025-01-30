import env from "../_data/env.js";
import { getContent20 } from "../api/delivery/sdk.gen.js";

// Async recursive (!!) filter to get the menu items for subpage navigation menus.
// Probably a horrendous way to do this, and results in additional API calls to
// get content that we have already retrieved earlier. I do also wonder if the
// recursive async calls could cause any weird issues. But it works on my
// machine, at least for now 😂.
export default async function subpageNavigation(nodeId, levels = 1) {
	// Base case to stop recursion
	if (levels < 1) {
		return [];
	}

	// Get the children of the given node ID from the Delivery API
	const response = await getContent20({
		query: {
			fetch: `children:${nodeId}`,
			// Sorted as they are in the backoffice tree
			sort: ["sortOrder:asc"],
			// Ensure we get them "all" and not just the default 10
			take: env.umbracoDeliveryAPITake,
		},
	});

	const items = await Promise.all(
		response.data.items
			// Ensure we only provide links to *pages*
			.filter((node) => node.contentType.endsWith("Page"))
			.map(async (node) => {
				return {
					key: node.id,
					url: node.route.path,
					title: node.properties.mainHeading || node.name,
					// Recursive call with levels parameter decremented by 1
					// until an empty list is returned.
					children: await subpageNavigation(node.id, levels - 1),
				};
			}),
	);

	// To see how these items are rendered out to HTML, have a look at
	// `_includes/partials/subpage-navigation.njk`.
	return items;
}
