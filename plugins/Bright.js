const { applyEffect } = require("../Core/,!.js");

module.exports = {
    command: "brightnesseff",
    alias: ["bright"],
    category: "media",
    desc: "Adjust image brightness",

    execute: async (sock, m, { args, reply }) => {

        if (!m.quoted) return reply("Reply to an image.");
        if (!m.quoted.mtype?.includes("image"))
            return reply("Reply to an image only.");

        try {

            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "brightness", args);

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "✨ Brightness effect applied ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to edit image.");
        }
    }
};