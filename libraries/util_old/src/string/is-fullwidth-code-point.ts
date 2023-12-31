/*
    copied from "is-fullwidth-code-point/index.js"
    the package.json of this module has the field "type" set to "module"
    it should never be in a library because if it used in a binary, node will
    load this package using the ESM loader even if the source of the lib has
    been compiled in CommonJS
*/

/* eslint-disable yoda */

export const isFullwidthCodePoint = (codePoint: number) => {
    if (!Number.isInteger(codePoint)) {
        return false;
    }

    // Code points are derived from:
    // https://unicode.org/Public/UNIDATA/EastAsianWidth.txt
    return codePoint >= 0x1100 && (
        codePoint <= 0x115F || // Hangul Jamo
        codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
        codePoint === 0x232A || // RIGHT-POINTING ANGLE BRACKET
        // CJK Radicals Supplement .. Enclosed CJK Letters and Months
        (0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F) ||
        // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
        (0x3250 <= codePoint && codePoint <= 0x4DBF) ||
        // CJK Unified Ideographs .. Yi Radicals
        (0x4E00 <= codePoint && codePoint <= 0xA4C6) ||
        // Hangul Jamo Extended-A
        (0xA960 <= codePoint && codePoint <= 0xA97C) ||
        // Hangul Syllables
        (0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
        // CJK Compatibility Ideographs
        (0xF900 <= codePoint && codePoint <= 0xFAFF) ||
        // Vertical Forms
        (0xFE10 <= codePoint && codePoint <= 0xFE19) ||
        // CJK Compatibility Forms .. Small Form Variants
        (0xFE30 <= codePoint && codePoint <= 0xFE6B) ||
        // Halfwidth and Fullwidth Forms
        (0xFF01 <= codePoint && codePoint <= 0xFF60) ||
        (0xFFE0 <= codePoint && codePoint <= 0xFFE6) ||
        // Kana Supplement
        (0x1B000 <= codePoint && codePoint <= 0x1B001) ||
        // Enclosed Ideographic Supplement
        (0x1F200 <= codePoint && codePoint <= 0x1F251) ||
        // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
        (0x20000 <= codePoint && codePoint <= 0x3FFFD)
    );
};
