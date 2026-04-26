const { applyEffect } = require("../Core/,!.js");

module.exports = {
    command: "grayeff",
    alias: ["grey"],
    category: "media",
    description: "Convert image to grayscale",

    execute: async (sock, m, { reply }) => {

        if (!m.quoted) return reply("Reply to an image.");
        if (!m.quoted.mtype?.includes("image"))
            return reply("Reply to an image only.");

        try {

            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "gray");

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "💫 Gray effect applied ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to edit image.");
        }
    }
};