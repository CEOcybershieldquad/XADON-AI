// ====================== XADON AI STATUS POSTER ======================

const { downloadContentFromMessage } = require('@itsliaaa/baileys');

module.exports = {
    command: 'poststatus',
    alias: ['pst', 'statuspost'],
    category: 'tools',
    desc: 'Send any replied media to WhatsApp Status',
    reactions: {
        start: '📤',
        success: '✅',
        error: '❌'
    },

    execute: async (client, m, { reply }) => {
        try {

            // MUST reply to media
            if (!m.quoted) {
                return reply('❌ Reply to any image/video/audio/sticker to post as status');
            }

            const q = m.quoted;
            const type = q.mtype;

            const allowed = [
                'imageMessage',
                'videoMessage',
                'audioMessage',
                'stickerMessage'
            ];

            if (!allowed.includes(type)) {
                return reply('❌ Only image, video, audio, or sticker allowed');
            }

            // Download media
            const stream = await q.download();
            if (!stream) return reply('❌ Failed to download media');

            let msg = {};

            // Build status message
            if (type === 'imageMessage') {
                msg = {
                    image: stream,
                    caption: q.text || q.caption || ''
                };
            }

            else if (type === 'videoMessage') {
                msg = {
                    video: stream,
                    caption: q.text || q.caption || '',
                    mimetype: 'video/mp4'
                };
            }

            else if (type === 'audioMessage') {
                msg = {
                    audio: stream,
                    mimetype: 'audio/mpeg',
                    ptt: false
                };
            }

            else if (type === 'stickerMessage') {
                msg = {
                    sticker: stream
                };
            }

            // ======================
            // SEND TO WHATSAPP STATUS
            // ======================
            await client.sendMessage('status@broadcast', msg);

            await client.sendMessage(m.chat, {
                react: { text: '🚀', key: m.key }
            });

            reply('✅ Media posted to WhatsApp Status successfully');

        } catch (err) {
            console.error('[XADON STATUS ERROR]', err);
            reply('❌ Failed to post status: ' + err.message);
        }
    }
};