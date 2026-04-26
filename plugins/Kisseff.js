const { applyEffect } = require("../Core/@,.js");

module.exports = {
    command: "kisseff",
    category: "overlays",
    desc: "Apply kiss effect",

    execute: async (sock, m, { reply }) => {

        if (!m.quoted?.mtype?.includes("image"))
            return reply("Reply to an image.");

        try {
            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "kiss");

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "XADON Kiss effect applied ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to apply jail effect.");
        }
    }
};