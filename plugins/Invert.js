const { applyEffect } = require("../Core/,!.js");

module.exports = {
    command: "invert",
    alias: [],
    category: "media",
    desc: "Invert image colors",

    execute: async (sock, m, { reply }) => {

        if (!m.quoted) return reply("Reply to an image.");
        if (!m.quoted.mtype?.includes("image"))
            return reply("Reply to an image only.");

        try {

            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "invert");

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "✨ Inverted by XADON ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to edit image.");
        }
    }
};