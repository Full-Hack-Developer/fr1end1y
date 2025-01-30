/**
 * Just a simple wrapper around `console` for printing messages during the
 * build. Nothing special.
 */

// A string to prepend to all log messages
const prefix = "[fr1end1y] ";

export function logError(message) {
	console.error(`${prefix}ERROR: ${message}`);
}

export function logInfo(message) {
	console.log(`${prefix}INFO: ${message}`);
}

export function logWarning(message) {
	console.warn(`${prefix}WARNING: ${message}`);
}
