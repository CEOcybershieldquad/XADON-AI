// commands/general/afk.js
// .afk [reason]   → sets you AFK (auto-reply when tagged)

const afkUsers = new Map(); // Store AFK status (global for simplicity)

module.exports = {
    command: 'afk',
    aliases: ['offline', 'brb'],
    description: 'Set AFK status (auto-reply when tagged)',
    category: 'general',

    execute: async (sock, m, { args, text }) => {
        const reason = text.trim() || "AFK — back soon";

        afkUsers.set(m.sender, {
            reason,
            time: new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'Africa/Lagos' })
        });

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Africa/Lagos' });
        const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();

        const menu = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
       *XADON AI  •  AFK MODE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

┌──────────────────────────────┐
│  AFK status activated        │
│                              │
│  User: @${m.sender.split('@')[0]}     │
│  Reason: ${reason}           │
│                              │
│  Time: ${timeStr} WAT        │
│  Date: ${dateStr}            │
│                              │
│  Created by Musteqeem ✨      │
└──────────────────────────────┘

> I’ll let people know you’re AFK 😴`;

        await sock.sendMessage(m.chat, {
            text: menu,
            mentions: [m.sender]
        }, { quoted: m });

        await sock.sendMessage(m.chat, { react: { text: "💤", key: m.key } });
    }
};

// Auto-reply when tagged while AFK (add this to your messages.upsert handler)

if (afkUsers.has(m.sender) && m.mentionedJid?.includes(m.sender)) {
    const afkData = afkUsers.get(m.sender);
    await sock.sendMessage(m.chat, {
        text: `💤 @${m.sender.split('@')[0]} is currently AFK\nReason: ${afkData.reason}\nSince: ${afkData.time}`,
        mentions: [m.sender]
    }, { quoted: m });
}