import posthtml from "posthtml";
import matchHelper from "posthtml-match-helper";
import { insertAt } from "posthtml-insert-at";

// CSS selector used to identify headings with `id` attributes
const HEADINGS_SELECTOR = "h2[id], h3[id], h4[id], h5[id], h6[id]";

// CSS class name for the table of contents element (without the `.` prefix).
// In `_includes/pages/webPage.njk`, this is an HTML `details` element, but it
// could be any block element.
const TOC_CLASS = "table-of-contents";

// Recursively get the text within a given HTML node. Headings can contain
// other elements but we only care about the text for the table of contents.
function getNodeText(node) {
	if (!node.content) {
		return "";
	}

	return node.content
		.map((entry) => {
			if (typeof entry === "string") {
				return entry;
			}
			if (Array.isArray(entry.content)) {
				return getNodeText(entry);
			}
			return "";
		})
		.join("");
}

// Extract the headings with `id` attributes in the given HTML content
async function getHeadingsWithIds(content) {
	const headings = [];

	// Variables to keep track of previous headings and ancestors as we iterate
	// over them. This is so we can tell when the heading level changes and
	// assign appropriate parent IDs to headings for nesting later on.
	let previousHeading = null;
	const ancestorHeadingIds = [];

	await posthtml()
		.use(function (tree) {
			tree.match(matchHelper(HEADINGS_SELECTOR), function (node) {
				const currentHeading = {
					id: node.attrs.id,
					parentId: null,
					level: parseInt(node.tag.slice(-1)),
					text: getNodeText(node),
				};

				if (previousHeading) {
					if (currentHeading.level > previousHeading.level) {
						// We have moved down a level (e.g., from `h2` to `h3`).
						// The previous heading will be made the parent of the
						// current heading.
						ancestorHeadingIds.push(previousHeading.id);
					} else if (currentHeading.level < previousHeading.level && ancestorHeadingIds.length > 0) {
						// We have moved up a level (e.g., from `h3` to `h2`)
						// so get rid of the last pushed ancestor.
						ancestorHeadingIds.pop();
					}
				}

				if (ancestorHeadingIds.length > 0) {
					// Set the heading parent to the most recent ancestor
					currentHeading.parentId =
						ancestorHeadingIds[ancestorHeadingIds.length - 1];
				}

				headings.push(currentHeading);
				previousHeading = currentHeading;
			});
		})
		.process(content);

	return headings;
}

// Generate a nested HTML list for a given array of headings, with some more
// recursive fun.
function tableOfContentsList(headings, parentId = null) {
	// The headings with `null` parents will form the root nodes for the table
	// of contents.
	const children = headings.filter((heading) => heading.parentId === parentId);

	// Stop when there are no more child items
	if (children.length === 0) {
		return "";
	}

	return `
		<ul>
			${children
				.map((heading) => {
					return `
						<li>
							<a href="#${heading.id}">
								${heading.text}
							</a>
							${tableOfContentsList(headings, heading.id)}
						</li>
					`;
				})
				.join("")}
		</ul>
	`;
}

// An HTML transform that injects tables of contents into pages that define the
// `.table-of-contents` block element.
export default async function (content) {
	// Ensure we only deal with pages containing the table of contents element.
	// Avoids unnecessary processing of the HTML.
	if (
		!(this.page.outputPath || "").endsWith(".html") ||
		!content.includes(TOC_CLASS)
	) {
		return content;
	}

	// Extract the headings with `id` attributes from the HTML content
	const headings = await getHeadingsWithIds(content);
	if (headings.length === 0) {
		// No headings, nothing to do
		return content;
	}

	// Insert the table of contents into the HTML
	const result = await posthtml()
		.use(
			insertAt({
				selector: `.${TOC_CLASS}`,
				append: tableOfContentsList(headings),
			}),
		)
		.process(content);
	return result.html;
}
