const reminders = new Map();

module.exports = {
    command: 'xremind',
    alias: ['remind', 'reminder', 'alert', 'timer'],
    description: 'Set a reminder with mention alert',
    category: 'tools',
    usage: '.xremind <time> <message>',

    execute: async (sock, m, { args, reply, prefix }) => {
        if (args.length < 2) {
            return reply(`֎ ✪ *XADON AI • REMINDER* ✪ ֎

⏰ Usage:.xremind <time> <message>

Time formats:
• s = seconds → 30s
• m = minutes → 10m
• h = hours → 2h

Examples:
-.xremind 10m Take a break
-.xremind 1h Call mom
-.xremind 30s Check oven

💡 You will be mentioned when time is up

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🚀', key: m.key } });

        const timeArg = args[0];
        const message = args.slice(1).join(' ');

        // Parse time: supports s, m, h
        const match = timeArg.match(/^(\d+)(s|m|h)$/);
        if (!match) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ Invalid time format

Use: s, m, or h
Example: 10m, 30s, 1h

> ֎`);
        }

        let ms = parseInt(match[1]);
        const unit = match[2];
        if (unit === 's') ms *= 1000;
        if (unit === 'm') ms *= 60 * 1000;
        if (unit === 'h') ms *= 60 * 60 * 1000;

        // Max 24h limit to prevent memory issues
        if (ms > 24 * 60 * 60 * 1000) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply('❌ Maximum reminder time is 24h\n\n> ֎');
        }

        const userJid = m.sender;
        const userTag = '@' + userJid.split('@')[0];

        await reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • REMINDER SET*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⏰ Time: ${timeArg}
📝 Task: ${message}
👤 For: ${userTag}

💡 I'll mention you when it's time

> ֎`);

        await sock.sendMessage(m.chat, { react: { text: '⏲️', key: m.key } });

        const timeoutId = setTimeout(async () => {
            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • REMINDER ALERT*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🧭 ${userTag} REMINDER:

📝 ${message}

⏰ Time's up!

> ֎`,
                mentions: [userJid]
            }, { quoted: m });

            reminders.delete(timeoutId);
        }, ms);

        reminders.set(timeoutId, {
            user: userJid,
            chat: m.chat,
            message,
            time: Date.now() + ms
        });
    }
};