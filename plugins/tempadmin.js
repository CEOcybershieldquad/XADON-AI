const ms = require('ms')

module.exports = {
    command: 'tempadmin',
    alias: ['tadmin'],
    description: 'Give temporary admin',
    category: 'group',
    usage: '.tempadmin @user 10m',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        let target;
        let timeArg;

        // ✅ Mention
        if (m.mentionedJid?.length) {
            target = m.mentionedJid[0];
            timeArg = args[1];

        // ✅ Reply
        } else if (m.quoted) {
            target = m.quoted.sender;
            timeArg = args[0];

        // ✅ Number
        } else if (args[0]) {
            let number = args[0].replace(/[^0-9]/g, '');

            if (number.startsWith('0')) {
                number = '234' + number.slice(1);
            }

            target = number + '@s.whatsapp.net';
            timeArg = args[1];

        } else {
            return reply(`╔═══════════════════════╗
   ✦ *XADON AI • TEMPADMIN* ✦
╚═══════════════════════╝

📌 *Usage Methods:*
• Reply → *.tempadmin 5m*
• Tag → *.tempadmin @user 10m*
• Number → *.tempadmin 234xxxxxxxxxx 10m*

⏳ Supports: s, m, h, d

> XADON AI`);
        }

        // ❌ No time
        if (!timeArg) {
            return reply('⚠️ Please provide duration (e.g. 10m)\n> XADON AI');
        }

        const duration = ms(timeArg);

        if (!duration) {
            return reply('❌ Invalid time format\n> XADON AI');
        }

        try {

            // ⚡ Promote
            await sock.groupParticipantsUpdate(m.chat, [target], 'promote');

            const num = target.split('@')[0];

            await sock.sendMessage(m.chat, {
                text: `╔═══════════════════════╗
   ✦ *XADON AI • TEMP ADMIN* ✦
╚═══════════════════════╝

👤 *@${num}* is now Admin

⏳ Duration: ${timeArg}
⚡ Status: Active

> XADON AI`,
                mentions: [target]
            });

            // ⏳ Auto demote
            setTimeout(async () => {

                await sock.groupParticipantsUpdate(m.chat, [target], 'demote');

                await sock.sendMessage(m.chat, {
                    text: `╔═══════════════════════╗
   ✦ *XADON AI • EXPIRED* ✦
╚═══════════════════════╝

📉 *@${num}* admin removed

⏳ Time ended: ${timeArg}

> XADON AI`,
                    mentions: [target]
                });

            }, duration);

        } catch (err) {

            console.error('[TEMPADMIN ERROR]', err?.message || err);

            let msg = '❌ Failed to set temp admin\n\n';

            if (err.message?.includes('admin')) {
                msg += '• Bot needs admin rights';
            } else if (err.message?.includes('permission')) {
                msg += '• Permission denied';
            } else {
                msg += `• ${err.message}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};