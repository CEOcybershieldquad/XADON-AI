// commands/general/block.js
// .block   → block the replied user or mentioned user
// .unblock → unblock

module.exports = {
    command: 'block',
    aliases: ['blk', 'banuser', 'blockuser'],
    description: 'Block or unblock a user (replied or mentioned)',
    category: 'owner',

    execute: async (sock, m, { args, text, reply }) => {
        // Get target user (replied or mentioned)
        let targetJid = null;

        if (m.quoted) {
            targetJid = m.quoted.sender;
        } else if (m.mentionedJid?.length > 0) {
            targetJid = m.mentionedJid[0];
        }

        if (!targetJid) {
            return reply("Reply to a message or mention someone to block/unblock.");
        }

        const action = m.text.toLowerCase().startsWith('.unblock') ? 'unblock' : 'block';

        try {
            if (action === 'block') {
                await sock.updateBlockStatus(targetJid, 'block');
                actionText = "BLOCKED";
                emoji = "🚫";
            } else {
                await sock.updateBlockStatus(targetJid, 'unblock');
                actionText = "UNBLOCKED";
                emoji = "✅";
            }

            // Beautiful neon confirmation menu
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                timeZone: 'Africa/Lagos' 
            });
            const dateStr = now.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            }).toUpperCase();

            const menu = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
       *XADON AI  •  USER ${actionText}*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

┌──────────────────────────────┐
│  Action completed            │
│                              │
│  User: @${targetJid.split('@')[0]}     │
│  Status: ${actionText}         │
│                              │
│  Time: ${timeStr} WAT        │
│  Date: ${dateStr}            │
│                              │
│  Created by Musteqeem ✨      │
└──────────────────────────────┘

> User ${actionText.toLowerCase()} • No more interaction ${emoji}`;

            await sock.sendMessage(m.chat, {
                text: menu,
                mentions: [targetJid]
            }, { quoted: m });

            // Reaction
            await sock.sendMessage(m.chat, {
                react: { text: emoji, key: m.key }
            });

        } catch (err) {
            console.error("Block error:", err.message || err);

            let errMsg = "⚠️ Failed to block/unblock user.";

            if (err.message?.includes("not found")) {
                errMsg = "User not found or invalid.";
            }

            await reply(errMsg);
        }
    }
};