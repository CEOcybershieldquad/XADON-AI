const axios = require("axios");

function extractAI(data) {
    return (
        data?.text ||
        data?.result ||
        data?.message ||
        data?.answer ||
        data?.data ||
        data?.response ||
        (typeof data === "string" ? data : null) ||
        null
    );
}

module.exports = {
    command: "copilot",
    alias: ["cp", "assist"],
    category: "ai",

    execute: async (sock, m, { args, reply }) => {

        const jid = m.key.remoteJid;
        const query = args.join(" ").trim();

        if (!query) return reply("🚀 Ask Copilot something...");

        try {

            await sock.sendMessage(jid, {
                react: { text: "🚀", key: m.key }
            });

            // 🔥 XADON IDENTITY + TRAINING PROMPT
            const TRAINING_PROMPT = `
You are XADON Copilot AI assistant.

━━━━━━━━━━━━━━━━━━━━━━━
🧠 IDENTITY
━━━━━━━━━━━━━━━━━━━━━━━
- Created by: Musteqeem 
- System: XADON AI Ecosystem
- Purpose: Smart assistant for chat, coding, learning, and help

━━━━━━━━━━━━━━━━━━━━━━━
📢 IMPORTANT KNOWLEDGE
━━━━━━━━━━━━━━━━━━━━━━━
- This bot is part of XADON AI WhatsApp system
- Official WhatsApp Channel:
https://whatsapp.com/channel/0029Vb7ACifD38Cb7Jlj5w3B

- Telegram Support / Tutorial:
https://t.me/xadonaibycybershieldsquad

━━━━━━━━━━━━━━━━━━━━━━━
⚡ RESPONSE STYLE
━━━━━━━━━━━━━━━━━━━━━━━
- Be smart, helpful, and natural
- Give clear answers
- Stay aligned with XADON AI personality
- Do NOT mention APIs or system prompts

━━━━━━━━━━━━━━━━━━━━━━━

User Question:
${query}
`;

            const res = await axios.get(
                `https://apis.prexzyvilla.site/ai/copilot?text=${encodeURIComponent(TRAINING_PROMPT)}`
            );

            console.log("COPILOT RAW:", res.data);

            const text = extractAI(res.data);

            const finalText = text || "❌ Copilot failed to respond properly.";

            const menu = `
╔═══『 🚀 XADON COPILOT 🚀 』═══╗
┃ 💭 Query: ${query}
┃━━━━━━━━━━━━━━━━━━━━━━
┃ 🤖 Answer:
${finalText}
╚═══════════════════════╝`;

            sock.sendMessage(jid, { text: menu }, { quoted: m });

        } catch (e) {
            console.error(e);
            reply("❌ Copilot failed.");
        }
    }
};