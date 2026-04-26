// commands/fun/emojimix.js
// .emojimix 🔥❤️   or reply to two emojis

const fetch = require('node-fetch');

module.exports = {
    command: 'emojimix',
    aliases: ['mix', 'emojisticker'],
    description: 'Mix two emojis into a sticker',
    category: 'fun',

    execute: async (sock, m, { args }) => {
        let emojis = args.join('').trim();

        if (m.quoted) {
            const qtext = m.quoted.body || m.quoted.conversation || "";
            const emojiRegex = /[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}]+/gu;
            const quotedEmojis = [...qtext.matchAll(emojiRegex)].map(m => m[0]);
            if (quotedEmojis.length >= 2) emojis = quotedEmojis.slice(0, 2).join('');
        }

        if (emojis.length < 2) {
            return reply("Send two emojis!\nExample: .emojimix 🔥❤️\nor reply to text with emojis");
        }

        try {
            const res = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FX3q7yJ8Xq6rG1bM6fN6kE&q=${encodeURIComponent(emojis)}&collection=emoji&contentfilter=high`);
            const data = await res.json();

            if (!data.results?.length) return reply("No mix found for these emojis 😅");

            const gifUrl = data.results[0].media_formats.gif.url;

            await sock.sendMessage(m.chat, {
                video: { url: gifUrl },
                gifPlayback: true,
                caption: `✨ ${emojis} mixed by XADON AI\nCreated by Musteqeem`
            }, { quoted: m });

        } catch (err) {
            reply("⚠️ Couldn't mix these emojis right now.");
        }
    }
};