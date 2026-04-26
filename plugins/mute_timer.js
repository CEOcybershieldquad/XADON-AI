// commands/group/mutegroup.js
// .mutegroup 30m   → mute entire group for 30 minutes (only admins can speak)
// .mutegroup       → mute indefinitely
// .unmutegroup     → restore normal chat

const ms = require('ms'); // npm install ms

module.exports = {
    command: 'mute-timer',
    aliases: ['groupmute', 'lockchat', 'announce'],
    description: 'Mute entire group (announcement mode) with optional timer',
    category: 'group',

    execute: async (sock, m, { args, text }) => {
        if (!m.isGroup) return reply("This command works only in groups.");

        // Check if bot is admin
        const meta = await sock.groupMetadata(m.chat);
        const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = meta.participants.some(p => p.id === botJid && p.admin);

        if (!isBotAdmin) return reply("Bot must be group admin to mute the group.");

        // Parse duration
        let durationMs = 0;
        let durationText = "indefinitely";

        if (args.length > 0) {
            const durArg = args[0].toLowerCase();
            durationMs = ms(durArg);
            if (!durationMs || durationMs < 60000) {
                return reply("Invalid duration.\nExamples:\n.mutegroup 30m\n.mutegroup 2h\n.mutegroup 1d");
            }
            durationText = durArg;
        }

        try {
            // Switch group to announcement mode (only admins can send messages)
            await sock.groupSettingUpdate(m.chat, { announcement: true });

            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Africa/Lagos' });
            const dateStr = now.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            }).toUpperCase();

            const menu = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
       *XADON AI  •  GROUP MUTED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

┌──────────────────────────────┐
│  Group chat muted            │
│  (announcement mode active)  │
│                              │
│  Only admins can speak now   │
│  Duration: ${durationText}   │
│                              │
│  Time: ${timeStr} WAT        │
│  Date: ${dateStr}            │
│                              │
│  Created by Musteqeem ✨      │
└──────────────────────────────┘

> Group will auto-unmute in ${durationText} (if set) 🔇`;

            await sock.sendMessage(m.chat, { text: menu }, { quoted: m });

            // Auto-unmute after duration
            if (durationMs > 0) {
                setTimeout(async () => {
                    try {
                        await sock.groupSettingUpdate(m.chat, { announcement: false });

                        const unmuteMsg = `🔊 *GROUP UNMUTED*\n\nNormal chat restored. Everyone can send messages again.\n\nXADON AI • ${new Date().toLocaleTimeString('en-US', { hour12: false })}`;

                        await sock.sendMessage(m.chat, { text: unmuteMsg });
                    } catch (e) {
                        console.error("Auto-unmute failed:", e);
                    }
                }, durationMs);
            }

            await sock.sendMessage(m.chat, {
                react: { text: "🔇", key: m.key }
            });

        } catch (err) {
            console.error("Group mute error:", err);
            reply("⚠️ Failed to mute group.\n" + (err.message || "Check bot admin rights."));
        }
    }
};