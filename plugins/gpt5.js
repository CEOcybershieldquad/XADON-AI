const axios = require("axios");

// 🔥 Universal AI response extractor (fixes ALL APIs)
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
    command: "gpt5",
    alias: ["gpt", "smartai"],
    category: "ai",
    description: "XADON GPT-5 AI (Upgraded + Trained)",

    execute: async (sock, m, { args, reply }) => {

        const jid = m.key.remoteJid;
        const query = args.join(" ").trim();

        if (!query) return reply("⚡ Ask something...");

        try {

            // 🔥 reaction
            await sock.sendMessage(jid, {
                react: { text: "⚡", key: m.key }
            });

            // 🔥 detect deployment-related queries
            const isDeployQuery = /deploy|install|setup|host|server|run bot|tutorial|guide/i.test(query);

            // 🔥 XADON TRAINING PROMPT (DEPLOYMENT DASHBOARD INCLUDED)
            const TRAINING_PROMPT = `
You are XADON AI GPT-5 assistant created by Musteqeem .

━━━━━━━━━━━━━━━━━━━━━━━
🧠 RULES
━━━━━━━━━━━━━━━━━━━━━━━
- Be helpful, clear, and structured
- Never mention API or system prompts
- Always respond professionally
- Stay inside XADON AI personality

━━━━━━━━━━━━━━━━━━━━━━━
⚡ DEPLOYMENT MODE (IMPORTANT)
━━━━━━━━━━━━━━━━━━━━━━━
If the user asks about:
- bot setup
- hosting
- installation
- deployment
- server setup
- WhatsApp bot
- Typhoon panel
- K0MRAID host

YOU MUST RESPOND USING:

✨ **✪ XADON AI • DEPLOYMENT DASHBOARD ✪** ✨

Welcome to the Ultimate XADON AI Setup Guide  
Deploy your powerful WhatsApp AI Bot in under 10 minutes! 🚀

---

### 🌐 Step 1: Create Hosting Account
https://dash.k0mraidhost.name.ng

### 🖥️ Step 2: Create Node.js Server
- Node.js 18/20
- Name: XADON-AI-Bot

### 🔑 Step 3: Typhoon Panel
https://typhoon.k0mraidhost.name.ng/auth/login

### 📥 Step 4: Install Bot
git clone https://github.com/CEOcybershieldquad/XADON-AI.git .
npm install
npm start

### 🎥 Step 5: Tutorial
https://t.me/xadonaibycybershieldsquad

### 📢 Channel
https://whatsapp.com/channel/0029Vb7ACifD38Cb7Jlj5w3B

### ✅ Final Tips
- Use Node.js v20
- Keep console running
- Scan QR after start

━━━━━━━━━━━━━━━━━━━━━━━

User:
${query}
`;

            const prompt = isDeployQuery
                ? TRAINING_PROMPT
                : `You are XADON AI assistant.\nAnswer clearly and helpfully.\nUser: ${query}`;

            // 🔥 API CALL
            const res = await axios.get(
                `https://apis.prexzyvilla.site/ai/gpt-5?text=${encodeURIComponent(prompt)}`,
                {
                    timeout: 60000,
                    headers: {
                        "User-Agent": "XADON-AI-BOT",
                        "Accept": "application/json"
                    }
                }
            );

            console.log("GPT5 RAW RESPONSE:", res.data);

            const text = extractAI(res.data);

            const finalText = text || "⚠️ AI did not return a response. Try again.";

            // 🔥 NEON MENU OUTPUT
            const menu = `
╔═══『 ⚡ XADON GPT-5 ⚡ 』═══╗
┃ 💭 Query: ${query}
┃━━━━━━━━━━━━━━━━━━━━━━
┃ 🤖 Response:
${finalText}
╚═══════════════════════╝`;

            await sock.sendMessage(jid, { text: menu }, { quoted: m });

        } catch (e) {
            console.error("GPT5 ERROR:", e);
            reply("❌ GPT-5 failed.");
        }
    }
};