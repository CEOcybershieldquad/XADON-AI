const delay = (ms) => new Promise(res => setTimeout(res, ms));

module.exports = {
    command: 'sendch',
    aliases: ['channelbug', 'chbug', 'sendchannel'],
    description: 'GOD MODE channel exploit sender',
    category: 'xadon',

    execute: async (sock, m, { args, reply }) => {

        if (!args[0]) {
            return reply(`⚠️ Usage:
.sendch <channel link> [message]

Example:
.sendch https://whatsapp.com/channel/xxxxx Join fast!`);
        }

        const link = args[0].trim();

        if (!link.includes('whatsapp.com/channel/')) {
            return reply('❌ Invalid WhatsApp channel link\n> XADON AI');
        }

        const customMsg = args.slice(1).join(' ');
        const name = m.pushName || "Unknown";

        try {

            // ⚡ START REACTION
            await sock.sendMessage(m.chat, {
                react: { text: "💻", key: m.key }
            });

            // 🧠 STEP-BY-STEP TERMINAL EFFECT
            await reply(`> booting exploit engine...`);
            await delay(700);

            await reply(`> connecting to whatsapp core servers...`);
            await delay(700);

            await reply(`> bypassing firewall ███░░░░ 35%`);
            await delay(600);

            await reply(`> bypassing firewall ██████░░ 70%`);
            await delay(600);

            await reply(`> bypassing firewall █████████ 100%`);
            await delay(800);

            await reply(`> injecting channel payload...`);
            await delay(700);

            await reply(`> generating invite vector...`);
            await delay(700);

            // 🔥 FINAL GOD MODE MESSAGE
            const final = `
╔══════════════════════════════════════╗
║        ⚡ XADON GODMODE CORE ⚡      ║
╚══════════════════════════════════════╝

> USER: ${name}
> ACCESS: ROOT GRANTED ✅

🚨 SYSTEM BREACH DETECTED 🚨

╭────────────────────────────╮
│ ⚠️ CHANNEL ACCESS LEAKED   │
│ ⚡ UNPATCHED ENTRY FOUND   │
╰────────────────────────────╯

${customMsg || '💎 Exclusive AI Channel unlocked...'}

🔗 ${link}

╭────────────────────────────╮
│ ⏳ ACCESS WINDOW: LIMITED  │
│ 🔐 SECURITY: UNSTABLE      │
│ ⚡ STATUS: ACTIVE          │
╰────────────────────────────╯

🚀 ACTION REQUIRED:
> Tap link immediately
> Join before access closes

━━━━━━━━━━━━━━━━━━━━━━━
⚡ Powered by XADON AI
💻 Future belongs to you
━━━━━━━━━━━━━━━━━━━━━━━
`;

            await delay(1000);

            await sock.sendMessage(m.chat, {
                text: final,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            });

            // 😈 MULTI REACTIONS (HYPE)
            const reacts = ["⚡", "🚨", "💻", "🔥"];
            for (let r of reacts) {
                await sock.sendMessage(m.chat, {
                    react: { text: r, key: m.key }
                });
                await delay(300);
            }

            // 🎯 FINAL HOOK MESSAGE
            await delay(800);
            await sock.sendMessage(m.chat, {
                text: `⚠️ LAST WARNING

Link may expire anytime...
Don't miss this chance 😈

> XADON AI`
            });

        } catch (err) {

            console.error('[GODMODE SENDCH ERROR]', err);

            reply(`❌ SYSTEM FAILURE

> ${err.message}

> XADON AI`);
        }
    }
};