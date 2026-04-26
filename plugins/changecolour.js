// commands/media/ch-colour.js
// .ch-colour red     → reply to image/sticker → recolor it red
// .ch-colour blue    → etc.

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'ch-colour',
  aliases: ['colorize', 'recolor', 'colour'],
  description: 'Recolor replied image or sticker',
  category: 'media',

  execute: async (sock, m, { args }) => {
    if (!m.quoted) return reply("Reply to an image or sticker with .ch-colour <color>");
    if (!args[0]) return reply("Please specify a color (red, blue, green, purple, etc.)");

    const color = args[0].toLowerCase();
    const supported = ['red', 'blue', 'green', 'purple', 'pink', 'yellow', 'orange', 'cyan', 'white', 'black'];

    if (!supported.includes(color)) {
      return reply(`Supported colors: ${supported.join(', ')}`);
    }

    try {
      const quoted = m.quoted;
      if (!['imageMessage', 'stickerMessage'].includes(quoted.mtype)) {
        return reply("Only images and stickers are supported.");
      }

      const buffer = await quoted.download();
      const tempIn = path.join(__dirname, `temp_in_${Date.now()}.webp`);
      const tempOut = path.join(__dirname, `temp_out_${Date.now()}.webp`);

      fs.writeFileSync(tempIn, buffer);

      // Simple ImageMagick command (needs imagemagick installed on server)
      const cmd = `convert "${tempIn}" -fill \( {color} -colorize 100 " \){tempOut}"`;

      exec(cmd, async (err) => {
        if (err) {
          console.error(err);
          return reply("Failed to recolor. ImageMagick may not be installed.");
        }

        await sock.sendMessage(m.chat, {
          sticker: fs.readFileSync(tempOut),
          mimetype: 'image/webp'
        }, { quoted: m });

        // Clean up
        fs.unlinkSync(tempIn);
        fs.unlinkSync(tempOut);
      });

    } catch (e) {
      reply("Error processing media.");
      console.error(e);
    }
  }
};