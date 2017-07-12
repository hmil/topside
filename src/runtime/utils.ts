/**
 * Escaping utility stolen from underscorejs
 */

interface EscapeMap {
    [key: string]: string;
}

// List of HTML entities for escaping.
const escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
};

// Functions for escaping and unescaping strings to/from HTML interpolation.
function createEscaper(map: EscapeMap) {
    const escaper = function(match: string) {
        return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    const source = "(?:" + Object.keys(map).join("|") + ")";
    const testRegexp = RegExp(source);
    const replaceRegexp = RegExp(source, "g");
    return function(input: string) {
        return testRegexp.test(input)
            ? input.replace(replaceRegexp, escaper)
            : input;
    };
}

export const __escape = createEscaper(escapeMap);
