const { applyEffect } = require("../Core/@,.js");

module.exports = {
    commands: "contrasteff",
    category: "overlays",
    description: "Adjust contrast of replied image",

    execute: async (sock, m, { args, reply }) => {

        if (!m.quoted?.mtype?.includes("image"))
            return reply("Reply to an image.");

        try {

            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "contrast", args);

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "XADON Contrast effect applied ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to edit image.");
        }
    }
};