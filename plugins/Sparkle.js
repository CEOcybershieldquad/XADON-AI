const { applyEffect } = require("../Core/,!.js");

module.exports = {
    command: "sparkleeff",
    category: "media",
    desc: "Sparkle glow effect",

    execute: async (sock, m, { args, reply }) => {

        if (!m.quoted?.mtype?.includes("image"))
            return reply("Reply to an image.");

        try {
            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "sparkle", args);

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "✨ Sparkling effect applied ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to edit image.");
        }
    }
};