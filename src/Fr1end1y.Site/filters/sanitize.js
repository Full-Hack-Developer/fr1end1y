import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

// Use DOMPurify to sanitise HTML markup and prevent XSS attacks
export default async function (markup) {
	const window = new JSDOM("").window;
	const purify = DOMPurify(window);
	const clean = purify.sanitize(markup, {
		// Allow `target` attribute so editors can configure links to open in
		// new tabs. The reverse tabnabbing vulnerability is addressed in
		// modern browsers and isn't as critical as before according to OWASP,
		// therefore I'm comfortable allowing it.
		// https://owasp.org/www-community/attacks/Reverse_Tabnabbing
		ADD_ATTR: ["target"],
	});
	return clean;
}
