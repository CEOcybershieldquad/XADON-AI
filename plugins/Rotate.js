const { applyEffect } = require("../Core/@,.js");

module.exports = {
    command: "rotateeff",
    alias: [],
    category: "overlays",
    desc: "Rotate a replied image",

    execute: async (sock, m, { args, reply }) => {

        if (!m.quoted) return reply("Reply to an image.");
        if (!m.quoted.mtype?.includes("image"))
            return reply("Reply to an image only.");

        try {

            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "rotate", args);

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "✨ Rotated ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to edit image.");
        }
    }
};