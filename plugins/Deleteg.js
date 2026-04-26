module.exports = {
    command: 'del',
    alias: ['delete'],
    category: 'group',
    description: 'Delete any message in chat (group or private)',

    // ⭐ Reaction config
    reactions: {
        start: '💬',
        success: '🧽',
        error: '❌'
    },

    execute: async (sock, m, { reply }) => {
        try {
            // 🔹 Start reaction
            await sock.sendMessage(m.chat, {
                react: { text: '💬', key: m.key }
            });

            if (!m.quoted) {
                return reply(`╭───〔 ✘ DELETE FAILED 〕───⬣
┃ ⚠️ _Reply to a message to delete it_
╰────────────────────⬣`);
            }

            // 🔐 Group permission che
            // 🧹 Delete message
            await sock.sendMessage(m.chat, {
                delete: m.quoted.key
            });

            // ✅ Success reaction
            await sock.sendMessage(m.chat, {
                react: { text: '🧽', key: m.key }
            });

            // ✨ Clean success message
            await reply(`╭───〔 🧽 MESSAGE DELETED 〕───⬣
┃ ✅ _Message removed successfully_
╰────────────────────⬣`);

        } catch (err) {
            console.error('[DEL ERROR]', err);

            // ❌ Error reaction
            await sock.sendMessage(m.chat, {
                react: { text: '❌', key: m.key }
            });

            reply(`╭───〔 ✘ ERROR 〕───⬣
┃ ❌ _Failed to delete message_
╰────────────────────⬣`);
        }
    }
};