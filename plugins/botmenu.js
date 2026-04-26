module.exports = {
    command: 'botmenu',
    alias: ['menu', 'hp', 'dashboard', 'start'],
    description: 'Show XADON AI command menu',
    category: 'general',

    execute: async (sock, m, { prefix, reply }) => {

        const jid = m.chat;

        // ⚡ Boot message
        const boot = await reply(`\`\`\`
> XADON AI INITIALIZING...
> CONNECTING TO CORE...
> STATUS: ONLINE ⚡
\`\`\``);

        setTimeout(() => {
            sock.sendMessage(jid, { delete: boot.key }).catch(() => {});
        }, 1500);

        // 🔥 Menu Sections
        const sections = [
            {
                title: '⚡ AI SYSTEM',
                rows: [
                    { title: 'AI Chat', rowId: `${prefix}ai`, description: 'Talk with AI brain' },
                    { title: 'Vision', rowId: `${prefix}vision`, description: 'Analyze images/videos' },
                    { title: 'TTS Voice', rowId: `${prefix}ttsm`, description: 'Convert text to voice' }
                ]
            },
            {
                title: '🎮 FUN & REACTIONS',
                rows: [
                    { title: 'Anime Reactions', rowId: `${prefix}anime`, description: 'Anime actions & gifs' },
                    { title: 'Kill', rowId: `${prefix}kill`, description: 'Send kill reaction 💀' }
                ]
            },
            {
                title: '🛠️ MEDIA TOOLS',
                rows: [
                    { title: 'Blur Image', rowId: `${prefix}xblur`, description: 'Blur image effect' },
                    { title: 'Green Effect', rowId: `${prefix}green`, description: 'Turn image green' }
                ]
            },
            {
                title: '👥 GROUP CONTROL',
                rows: [
                    { title: 'Kick User', rowId: `${prefix}kick`, description: 'Remove member' },
                    { title: 'Kick Last', rowId: `${prefix}kick-x`, description: 'Remove last sender(s)' }
                ]
            }
        ];

        try {

            // ⚡ Reaction
            await sock.sendMessage(jid, {
                react: { text: "⚡", key: m.key }
            });

            // 🚀 Send Menu
            await sock.sendMessage(jid, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • CONTROL PANEL*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🤖 Status: ONLINE
⚡ Version: 1.0.0
🧠 Intelligence: ACTIVE

Select a category below to explore commands 👇

> XADON AI`,
                footer: 'XADON AI • Powered by Cyber Shield ⚡',
                title: 'XADON AI MENU',
                buttonText: 'OPEN MENU',
                sections
            }, { quoted: m });

        } catch (err) {

            console.error('[MENU ERROR]', err?.message || err);

            reply(`❌ Failed to open menu

• Try again later

> XADON AI`);
        }
    }
};