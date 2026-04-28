module.exports = {
    command: 'clearchat',
    alias: ['clear', 'clr', 'wipe'],
    description: 'Wipe chat then start a new thread with status',
    category: 'tools',
    usage: '.clearchat',

    execute: async (sock, m, { reply }) => {
        try {
            if (!m.key.fromMe) {
                return reply('❌ Only bot owner can use this command\n> ֎');
            }

            await sock.sendMessage(m.chat, { react: { text: '🧹', key: m.key } });

            await sock.chatModify({
                delete: true,
                lastMessages: [{
                    key: m.key,
                    messageTimestamp: m.messageTimestamp
                }]
            }, m.chat);

            await new Promise(resolve => setTimeout(resolve, 2000));

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • CHAT CLEARED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🧹 Chat wiped successfully
⚡ New thread started

> ֎`
            });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[CLEARCHAT ERROR]', err?.message || err);

            let msg = '❌ Failed to clear chat\n\n';

            if (err.message?.includes('forbidden')) {
                msg += '• No permission to delete messages';
            } else if (err.message?.includes('rate')) {
                msg += '• Rate limited. Try again later';
            } else {
                msg += '• WhatsApp API error';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};