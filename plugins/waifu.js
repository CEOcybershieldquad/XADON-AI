// commands/anime/waifu.js
const fetch = require('node-fetch');

module.exports = {
    command: 'waifu',
    description: 'Get random anime waifu image',
    category: 'fun',

    execute: async (sock, m, { reply }) => {
        try {
            await reply("Searching for cute waifu... 😳");

            const res = await fetch('https://api.waifu.pics/sfw/waifu');
            const json = await res.json();

            if (!json.url) throw new Error("No image found");

            await sock.sendMessage(m.chat, {
                image: { url: json.url },
                caption: "Here's your waifu master\~ 💕\nPowered by XADON"
            }, { quoted: m });

        } catch (e) {
            await reply("Couldn't fetch waifu right now 😢\nTry again later!");
        }
    }
};