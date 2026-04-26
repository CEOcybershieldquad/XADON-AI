const { applyEffect } = require("../Core/@,.js");

module.exports = {
    command: "jaileff",
    category: "overlays",
    description: "Apply jail effect",

    execute: async (sock, m, { reply }) => {

        if (!m.quoted?.mtype?.includes("image"))
            return reply("Reply to an image.");

        try {
            const buffer = await m.quoted.download();
            const result = await applyEffect(buffer, "jail");

            await sock.sendMessage(m.chat, {
                image: result,
                mimetype: "image/png",
                caption: "🔒 XADON Jailed Him ✔"
            }, { quoted: m });

        } catch {
            reply("Failed to apply jail effect.");
        }
    }
};