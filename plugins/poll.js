module.exports = {
    command: 'poll',
    alias: ['createpoll', 'vote'],
    description: 'Create a WhatsApp native poll',
    category: 'group',
    usage: '.poll Question | Option1 | Option2',

    execute: async (sock, m, { args, reply, prefix }) => {

        // ❌ No input
        if (!args.length) {
            return reply(`╔═══════════════════════╗
   ✦ *XADON AI • POLL* ✦
╚═══════════════════════╝

📊 *Create Powerful Polls Instantly*

📌 *Formats:*
• Single → *.poll Question | Yes | No*
• Multi → *.poll multi Question | A | B | C*

⚡ Min: 2 Options
⚡ Max: 12 Options

> XADON AI`);
        }

        let isMulti = false;
        let fullText = args.join(' ').trim();

        // 🔥 Detect multi mode
        if (fullText.toLowerCase().startsWith('multi ')) {
            isMulti = true;
            fullText = fullText.slice(6).trim();
        }

        const parts = fullText.split('|').map(v => v.trim()).filter(Boolean);

        // ❌ Invalid format
        if (parts.length < 3) {
            return reply(`╔═══════════════════════╗
   ✦ *XADON AI • ERROR* ✦
╚═══════════════════════╝

❌ Invalid poll format

📌 Example:
*.poll Who is best? | Ronaldo | Messi*

> XADON AI`);
        }

        const question = parts[0];
        const options = parts.slice(1);

        // ❌ Too many options
        if (options.length > 12) {
            return reply(`❌ Maximum 12 options allowed\n> XADON AI`);
        }

        try {

            // 📊 Create Poll
            await sock.sendMessage(m.chat, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: isMulti ? 0 : 1
                }
            }, { quoted: m });

            // 💎 Success UI
            await sock.sendMessage(m.chat, {
                text: `╔═══════════════════════╗
   ✦ *XADON AI • POLL LIVE* ✦
╚═══════════════════════╝

📊 *Poll Created Successfully*

🧠 *Mode:* ${isMulti ? 'Multi Choice' : 'Single Choice'}
📌 *Options:* ${options.length}

⚡ Users can now vote

> XADON AI`
            });

            // ⚡ Reaction
            await sock.sendMessage(m.chat, {
                react: { text: "📊", key: m.key }
            });

        } catch (err) {

            console.error('[POLL ERROR]', err?.message || err);

            reply(`╔═══════════════════════╗
   ✦ *XADON AI • ERROR* ✦
╚═══════════════════════╝

❌ Failed to create poll

• ${err.message}

> XADON AI`);
        }
    }
};