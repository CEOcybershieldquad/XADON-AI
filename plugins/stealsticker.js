// commands/media/steal.js
// .steal Musteqeem VH   → reply to sticker → change pack/author
// .take packname authorname

module.exports = {
  command: 'steal',
  aliases: ['take', 'stickersteal'],
  description: 'Steal/rebrand replied sticker (change pack & author)',
  category: 'media',

  execute: async (sock, m, { args }) => {
    if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
      return reply("Reply to a sticker with .steal packname authorname");
    }

    let packname = "XADON";
    let author = "Musteqeem";

    if (args.length >= 2) {
      packname = args[0];
      author = args.slice(1).join(' ');
    } else if (args.length === 1) {
      packname = args[0];
    }

    try {
      const buffer = await m.quoted.download();

      // Simple re-send with new pack/author metadata
      await sock.sendMessage(m.chat, {
        sticker: buffer,
        packname,
        author
      }, { quoted: m });

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Africa/Lagos' });

      const menu = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
       *XADON AI  •  STICKER STOLEN*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

┌──────────────────────────────┐
│  Sticker rebranded           │
│  Pack: ${packname}           │
│  Author: ${author}           │
│                              │
│  Time: ${timeStr} WAT        │
│                              │
│  Created by Musteqeem ✨      │
└──────────────────────────────┘

> Stolen successfully ⚡`;

      await sock.sendMessage(m.chat, { text: menu }, { quoted: m });

    } catch (e) {
      reply("Failed to steal sticker 😔");
      console.error(e);
    }
  }
};