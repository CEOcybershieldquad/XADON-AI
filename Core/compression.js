// XADON AI Clean Compression System

const LZString = require('lz-string');

module.exports = {

    compress(text) {
        return LZString.compress(text);
    },

    decompress(text) {
        return LZString.decompress(text);
    },

    toBase64(text) {
        return LZString.compressToBase64(text);
    },

    fromBase64(text) {
        return LZString.decompressFromBase64(text);
    },

    toUTF16(text) {
        return LZString.compressToUTF16(text);
    },

    fromUTF16(text) {
        return LZString.decompressFromUTF16(text);
    }

};