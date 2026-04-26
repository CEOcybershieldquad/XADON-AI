module.exports = {
    command: 'pin',
    alias: ['pinmsg', 'unpin', 'pinned'],
    description: 'Pin or unpin a message in group',
    category: 'group',
    usage: '.pin (reply to message) |.unpin |.pin 1d |.pin 7d |.pin 30d',

    execute: async (sock, m, { args, reply, prefix, quoted }) => {
        const sub = args[0]?.toLowerCase();

        // ── UNPIN ────────────────────────────────────────────────
        if (sub === 'unpin' || sub === 'remove') {
            try {
                await sock.sendMessage(m.chat, {
                    pin: m.key,
                    type: 0 // 0 = unpin
                });
                await sock.sendMessage(m.chat, { react: { text: '📌', key: m.key } });
                return reply('✅ Message unpinned\n> ֎');
            } catch (error) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply('❌ Failed to unpin message\n\n• Bot needs admin rights\n\n> ֎');
            }
        }

        // ── PIN WITH DURATION ────────────────────────────────────
        const durations = {
            '1d': 86400, // 1 day
            '7d': 604800, // 7 days
            '30d': 2592000, // 30 days
            '24h': 86400,
            '1h': 3600
        };

        let time = 2592000; // Default: 30 days

        if (sub && durations[sub]) {
            time = durations[sub];
        }

        // ── MUST REPLY TO A MESSAGE ─────────────────────────────
        const target = quoted || m.quoted;
        if (!target) {
            await sock.sendMessage(m.chat, { react: { text: '📌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • PIN MESSAGE* ✪ ֎

📝 Usage: Reply to a message with.pin

Durations:
•.pin → 30 days default
•.pin 1d → 1 day
•.pin 7d → 7 days
•.pin 30d → 30 days
•.unpin → Remove pin

⚠️ Bot must be admin

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '📌', key: m.key } });

        try {
            await sock.sendMessage(m.chat, {
                pin: target.key,
                time: time,
                type: 1 // 1 = pin
            });

            // Format duration for response
            let durationText = '30 days';
            if (time === 86400) durationText = '1 day';
            else if (time === 604800) durationText = '7 days';
            else if (time === 3600) durationText = '1 hour';

            await sock.sendMessage(m.chat, { react: { text: '📅', key: m.key } });

            reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • MESSAGE PINNED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📌 Status: Pinned
⏰ Duration: ${durationText}

⚡ Pinned to group chat

> ֎`);

        } catch (error) {
            console.error('[PIN ERROR]', error.message);
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to pin message\n\n';

            if (error.message?.includes('forbidden')) {
                msg += '• Bot needs admin rights';
            } else if (error.message?.includes('not-authorized')) {
                msg += '• Not authorized to pin in this chat';
            } else {
                msg += '• Make sure bot is admin';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};