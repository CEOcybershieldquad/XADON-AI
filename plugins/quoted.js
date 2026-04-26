.xdn write plugins/quoted.js module.exports = {
    command: 'quoted',
    alias: ['quote', 'qmsg'],
    category: 'tools',
    desc: 'Get the original message you replied to',
    reactions: { start: '🔍', success: '✅' },

    execute: async (sock, m, { reply }) => {
        try {
            // Check if the message is replying to another message
            if (!m.quoted) return reply('❌ Please reply to a message to use this command.');

            const quotedMsg = m.quoted;

            // Determine the type of quoted message
            let content = '';
            if (quotedMsg.message) {
                const msgType = Object.keys(quotedMsg.message)[0];
                if (msgType === 'conversation') {
                    content = quotedMsg.message.conversation;
                } else if (msgType === 'extendedTextMessage') {
                    content = quotedMsg.message.extendedTextMessage.text;
                } else if (msgType === 'imageMessage') {
                    content = '[📷 Image]';
                } else if (msgType === 'videoMessage') {
                    content = '[🎥 Video]';
                } else if (msgType === 'documentMessage') {
                    content = '[📄 Document]';
                } else if (msgType === 'stickerMessage') {
                    content = '[✨ Sticker]';
                } else {
                    content = `[Message type: ${msgType}]`;
                }
            }

            // Send the quoted message content
            await reply(`🔹 *Quoted Message*:\n\n${content}`);
        } catch (err) {
            console.error(err);
            reply('❌ Failed to retrieve quoted message.');
        }
    }
};