module.exports = {
    command: 'kick-l',
    alias: ['kicklast', 'kick-last'],
    description: 'Kick the last person who sent a message in the group',
    category: 'group',
    usage: '.kick-l',

    execute: async (sock, m, { reply }) => {

        if (!m.isGroup)
            return reply('𓉤✨ This command works only in groups');

        try {
            // Fetch last 10 messages in the group
            const chat = await sock.fetchMessages(m.chat, { limit: 10 });

            // Find the last sender (excluding bot and commands)
            let lastMessage = chat.find(msg =>
                !msg.key.fromMe &&
                msg.key.participant !== sock.user.id &&
                !msg.message?.conversation?.startsWith('.') // ignore commands
            );

            const number = lastMessage.key.participant.split('@')[0];
            const jid = number + '@s.whatsapp.net';

            // Kick the last sender
            await sock.groupParticipantsUpdate(m.chat, [jid], 'remove');

            // Neon-style farewell message
            await sock.sendMessage(m.chat, {
                text: `🚀 ✪ Bye-bye @${number}!\nYou were the last to type and got kicked! 💥`,
                mentions: [jid]
            });

            await reply(`✓ ✪ Successfully kicked the last sender: <${number}> ✨`);

        } catch (err) {
            console.error('[KICK-L ERROR]', err?.message || err);
            let msg = '✘ 🧭 Failed to kick last sender\n\n';

            if (err.message?.includes('admin') || err.message?.includes('permission')) {
                msg += '• Bot needs admin rights\nMake me full admin 🌟';
            } else if (err.message?.includes('401') || err.message?.includes('forbidden')) {
                msg += '• User privacy settings block removing 🔒';
            } else {
                msg += `• Error: <${err.message || 'Unknown'}>`;
            }

            reply(`🌟 ${msg}`);
        }
    }
};