module.exports = {
    command: 'reject',
    alias: ['deny', 'rejectjoin'],
    description: 'Reject group join requests',
    category: 'group',
    usage: '.reject all / number',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        let requests;

        try {
            requests = await sock.groupRequestParticipantsList(m.chat);
        } catch (e) {
            return reply('❌ Failed to fetch join requests\n> XADON AI');
        }

        if (!requests.length)
            return reply('⚠️ No pending join requests\n> XADON AI');

        // ❌ REJECT ALL
        if (args[0]?.toLowerCase() === 'all') {

            const jids = requests.map(u => u.jid);

            await sock.groupRequestParticipantsUpdate(
                m.chat,
                jids,
                "reject"
            );

            return sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • REJECTION*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

❌ Rejected all requests

⚡ Total: ${jids.length}

> XADON AI`
            });
        }

        let target;

        // ❌ BY NUMBER
        if (args[0]) {
            let number = args[0].replace(/[^0-9]/g, '');

            if (number.length < 10)
                return reply('⚠️ Invalid number format\n> XADON AI');

            target = number + '@s.whatsapp.net';

        } else {
            // ❌ DEFAULT: first request
            target = requests[0].jid;
        }

        const exists = requests.find(u => u.jid === target);
        if (!exists)
            return reply('⚠️ User not in request list\n> XADON AI');

        try {

            await sock.groupRequestParticipantsUpdate(
                m.chat,
                [target],
                "reject"
            );

            const num = target.split('@')[0];

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • REJECTION*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

❌ @${num} request rejected

⚡ Access denied

> XADON AI`,
                mentions: [target]
            });

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

        } catch (err) {

            console.error('[REJECT ERROR]', err);

            reply(`❌ Failed to reject request

• ${err.message}

> XADON AI`);
        }
    }
};