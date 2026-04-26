const { generateTTS } = require('../Core/ttsEngine');

module.exports = {
    command: "tts",
    alias: ["say", "speak"],
    category: "tools",

    execute: async (sock, m, { args, reply }) => {

        let lang = "en";
        let text = "";

        if (m.quoted && !args.length) {
            text = m.quoted.text || m.quoted.caption || "";
        } else {
            const possibleLang = args[0]?.toLowerCase();

            const langs = ["en","ar","it","es","fr","el","hi"];

            if (langs.includes(possibleLang)) {
                lang = possibleLang;
                text = args.slice(1).join(" ");
            } else {
                text = args.join(" ");
            }
        }

        if (!text) {
            return reply(`🔊 Usage:
.tts hello world
.tts es hola
(reply to text)`);
        }

        await sock.sendMessage(m.chat, {
            react: { text: "🎧", key: m.key }
        });

        await generateTTS(sock, m, text, lang);

        const menu = `
╔═══『 🔊 XADON TTS PRO 』═══╗
┃ 🌍 Language: ${lang.toUpperCase()}
┃━━━━━━━━━━━━━━━━━━
┃ 📝 ${text.slice(0, 800)}
┃━━━━━━━━━━━━━━━━━━
┃ ✅ Voice Sent (HD)
╚══════════════════╝`;

        sock.sendMessage(m.chat, { text: menu }, { quoted: m });
    }
};