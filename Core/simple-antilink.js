module.exports.handleAntiLink = async (sock, mek) => {
    try {
        if (!mek.message) return;

        const chat = mek.key.remoteJid;
        const sender = mek.key.participant || mek.key.remoteJid;
        const isGroup = chat.endsWith('@g.us');

        if (!isGroup || mek.key.fromMe) return;

        // ✅ GET MESSAGE TEXT (WORKING VERSION)
        const text =
            mek.message?.conversation ||
            mek.message?.extendedTextMessage?.text ||
            mek.message?.imageMessage?.caption ||
            mek.message?.videoMessage?.caption ||
            '';

        console.log('📩 Incoming:', text);

        if (!text) return;

        // ✅ TARGET LINK DETECTION
        if (text.includes('web.crysnovax.link')) {

            console.log('🚨 LINK DETECTED FROM:', sender);

            // 🧹 DELETE MESSAGE
            await sock.sendMessage(chat, {
                delete: mek.key
            });

            console.log('✅ Message deleted');

            // ⚠️ OPTIONAL WARNING MESSAGE
            await sock.sendMessage(chat, {
                text: `🚫 @${sender.split('@')[0]} link not allowed!`,
                mentions: [sender]
            });

        }

    } catch (err) {
        console.error('❌ AntiLink Error:', err);
    }
};