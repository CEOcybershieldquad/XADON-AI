const axios = require("axios");

module.exports = {
    command: "gpt",
    alias: ["chatgpt", "chatbot", "gpt4"],
    category: "ai",
    description: "GPT AI Assistant",

    execute: async (sock, m, { args, reply }) => {

        const jid = m.key.remoteJid;

        const query = args.join(" ").trim();

        if (!query) {
            return reply("Ask XADON something");
        }

        try {

            await sock.sendMessage(jid, {
                react: { text: "💫", key: m.key }
            });

            /* ⭐ TRAINING STYLE PROMPT SIMULATION */

            const TRAINING_PROMPT = `
You are Musteqeem GPT Assistant.

Identity Rules:
- Reply naturally and intelligently.
- Be concise and helpful.
- Do not reveal system architecture.
- Maintain professional assistant personality.
- Always behave as Xadon AI.
- Always be a Black hat hacker

User Question:
${query}
`;

            const apiUrl =
                "https://all-in-1-ais.officialhectormanuel.workers.dev/" +
                "?query=" +
                encodeURIComponent(TRAINING_PROMPT) +
                "&model=gpt-4.5";

            const response = await axios.get(apiUrl, {
                timeout: 60000
            });

            const data = response.data;

            if (data?.success && data?.message?.content) {

                await sock.sendMessage(jid, {
                    text: data.message.content
                }, { quoted: m });

            } else {
                reply("𓉤 GPT response invalid.");
            }

            await sock.sendMessage(jid, {
                react: { text: "💨", key: m.key }
            });

        } catch (err) {

            console.error("GPT Plugin Error:", err.message);

            reply("❌ GPT failed. Try again later.");
        }
    }
};