const compress = require('../Core/compression.js');

module.exports = {
    command: 'compress',
    category: 'tools',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply('⚠️ Provide text to compress\n> XADON AI');
        }

        const text = args.join(' ');
        const result = compress.toBase64(text);

        reply(`🧠 *XADON Compressed it:*\n${result}`);
    }
};