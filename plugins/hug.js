// commands/waifu/hug.js
const fetch = require('node-fetch');

module.exports = {
  command: 'hug',
  description: 'Send a random anime hug gif',
  category: 'fun',
  execute: async (sock, m, { reply }) => {
    try {
      const res = await fetch('https://nekos.best/api/v2/hug');
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const json = await res.json();
      const gif = json.results[0]?.url;
      if (!gif) {
        throw new Error("No GIF URL in response");
      }
      await sock.sendMessage(m.chat, {
        video: { url: gif },
        gifPlayback: true,
        caption: "Sending virtual hug! 🤗"
      }, { quoted: m });
    } catch (err) {
      console.error(err);
      await reply("Hug failed... try again 😔");
    }
  }
};