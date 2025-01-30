import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * @see https://eslint.org/docs/latest/use/configure/
 * @type {import("eslint").Linter.Config[]}
 */
export default [
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	eslintConfigPrettier,
];
