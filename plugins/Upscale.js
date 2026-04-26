const { applyEffect } = require("../Core/,!.js");

module.exports = {
    command: "upscale",
    alias: [],
    category: "media",
    description: "Increase quality effect",

    execute: async (sock, m, { reply }) => {

        if (!m.quoted) return reply("Reply to an image.");
        if (!m.quoted.mtype?.includes("image"))
            return reply("Reply to an image only.");

        try {

            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "upscale");

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "✨ upscaled by XADON ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to edit image.");
        }
    }
};