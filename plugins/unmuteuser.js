module.exports = {
    command: 'unmute-user',
    aliases: ['unmuteuser', 'gunmute'],
    description: 'Unmute a user in the group (they can send messages again)',
    category: 'group',
    usage: '.unmute-user @user OR .unmute-user 234xxxxxxxxxx OR reply .unmute-user',

    execute: async (sock, m, { args, reply }) => {
        if (!m.isGroup) return reply('❌ This command works only in groups\n> XADON AI');

        let number;

        // Reply
        if (m.quoted) number = m.quoted.sender.split('@')[0];
        // Mention
        else if (m.mentionedJid?.length) number = m.mentionedJid[0].split('@')[0];
        // Full number
        else if (args[0]) number = args[0].replace(/[^0-9]/g, '');
        else return reply('🚀 Please reply, mention, or provide full number\n> XADON AI');

        const jid = number + '@s.whatsapp.net';

        try {
            // Lift restriction for this user
            await sock.groupParticipantsUpdate(m.chat, [jid], 'unrestrict');

            await sock.sendMessage(m.chat, {
                text: `🔊 @${number} has been unmuted (can send messages again) ✨\n> XADON AI`,
                mentions: [jid]
            });

        } catch (err) {
            console.error('[UNMUTE ERROR]', err?.message || err);
            reply('⚠️ Failed to unmute user. Make sure the bot is admin\n> XADON AI');
        }
    }
};