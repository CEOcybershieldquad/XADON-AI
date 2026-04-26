module.exports = {
    command: 'mute-user',
    aliases: ['muteuser', 'gmute'],
    description: 'Mute a user in the group (they cannot send messages)',
    category: 'group',
    usage: '.mute-user @user OR .mute-user 234xxxxxxxxxx OR reply .mute-user',

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
            // Restrict only this user (not everyone)
            await sock.groupParticipantsUpdate(m.chat, [jid], 'restrict');

            await sock.sendMessage(m.chat, {
                text: `🔇 @${number} has been muted (cannot send messages) ⚡\n> XADON AI`,
                mentions: [jid]
            });

        } catch (err) {
            console.error('[MUTE ERROR]', err?.message || err);
            reply('⚠️ Failed to mute user. Make sure the bot is admin\n> XADON AI');
        }
    }
};