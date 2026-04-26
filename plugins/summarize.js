// commands/ai/summarize.js
// .sum   → reply to long message/text

module.exports = {
    command: 'sum',
    aliases: ['summarize', 'summary', 'summ'],
    description: 'Summarize replied long text/message',
    category: 'ai',

    execute: async (sock, m, { reply }) => {
        if (!m.quoted) return reply("Reply to a long message with .sum");

        const text = m.quoted.body || m.quoted.conversation || m.quoted.caption || "";
        if (text.length < 50) return reply("Message is too short to summarize.");

        // Simple built-in summary (you can replace with Groq/Gemini API later)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const summary = sentences.length > 5 
            ? sentences.slice(0, 3).join('. ') + '... (shortened)' 
            : text;

        const msg = `✦ ───── ⋆⋅ SUMMARY ⋅⋆ ───── ✦

Original length: ${text.length} chars

Summary:
${summary}

> Created by Musteqeem ✨`;

        reply(msg);
    }
};