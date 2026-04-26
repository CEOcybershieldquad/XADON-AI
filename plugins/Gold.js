const { applyEffect } = require("../Core/,!.js");

module.exports = {
    command: "goldeff",
    category: "media",
    desc: "Apply gold effect",

    execute: async (sock, m, { args, reply }) => {

        if (!m.quoted?.mtype?.includes("image"))
            return reply("Reply to an image.");

        try {
            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "gold", args);

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "🟡 Gold effect applied ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to edit image.");
        }
    }
};