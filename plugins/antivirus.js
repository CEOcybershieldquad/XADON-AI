if (!global.groupSettings) {
    global.groupSettings = new Map(); // chatJid → { antivirus: true/false, ... }
}

module.exports = {
    command: 'antivirus',
    aliases: ['antivirtex', 'virtexguard', 'antivirus', 'novirtex'],
    category: 'antis',
    description: 'Toggle antivirus / anti-virtex (delete crash/bug texts)',
    usage: '.antivirus on / off',
    group: true,
    admin: true,
    botAdminNeeded: true,

        execute: async (sock, m, { args, reply }) => {
        try {
            await sock.sendMessage(m.chat, { react: { text: "🛡️", key: m.key } });

            if (args.length === 0) {
                const status = global.groupSettings.get(m.chat)?.antivirus ? 'ON' : 'OFF';
                return extra.reply(`Antivirus / Anti-Virtex is currently *${status}*.\nUse .antivirus on / off`);
            }

            const mode = args[0].toLowerCase();
            if (!['on', 'off'].includes(mode)) {
                return extra.reply("Invalid! Use .antivirus on / off");
            }

            if (!global.groupSettings.has(m.chat)) {
                global.groupSettings.set(m.chat, {});
            }
            global.groupSettings.get(m.chat).antivirus = mode === 'on';

            await sock.sendMessage(m.chat, {
                text: `🛡️ Antivirus / Anti-Virtex is now *${mode.toUpperCase()}*!\nCrash / virtex messages will be automatically deleted.`
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: mode === 'on' ? "✅" : "🔓", key: m.key } });

        } catch (err) {
            console.error('Antivirus toggle error:', err);
            await extra.reply("❌ Failed to toggle antivirus.");
            await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        }
    },

    // Real-time protection - self-contained listener
    initAnti(sock) {
        // Common virtex / crash patterns (Thai/Arabic combining chars, repeats, etc.)
        const virtexPatterns = [
            '๒๒๒', 'ดุ', 'ผิดุท้เึางื', 'ฆู้้', '่้้', '็', 'ิ้', 'ุ', 'ํ', '๋', 'ำ', 'ึ', '์',
            'ꪜ', 'ꪛ', 'ꪚ', 'ꪙ', 'xxxx',// more exotic ones
            // You can add more patterns from real attacks
        ];

        sock.ev.on('messages.upsert', async (upsert) => {
            if (upsert.type !== 'notify') return;

            for (const m of upsert.messages) {
                if (m.key.fromMe) continue; // skip bot's own messages

                const chat = m.key.remoteJid;
                if (!chat || !chat.endsWith('@g.us')) continue; // groups only

                const settings = global.groupSettings.get(chat) || {};
                if (!settings.antivirus) continue;

                // Skip admins (fetch metadata)
                let meta;
                try {
                    meta = await sock.groupMetadata(chat);
                } catch (e) {
                    continue;
                }

                const sender = m.key.participant;
                const isAdmin = meta.participants.some(p => p.id === sender && ['admin', 'superadmin'].includes(p.admin));
                if (isAdmin) continue;

                // Extract text from different message types
                let text = '';
                if (m.message?.conversation) text = m.message.conversation;
                else if (m.message?.extendedTextMessage?.text) text = m.message.extendedTextMessage.text;
                else if (m.message?.imageMessage?.caption) text = m.message.imageMessage.caption;
                else if (m.message?.videoMessage?.caption) text = m.message.videoMessage.caption;

                if (!text || text.length < 5) continue;

                text = text.toLowerCase();

                // Detection logic
                const isVirtex =
                    virtexPatterns.some(p => text.includes(p)) ||
                    text.length > 4000 || // unusually long messages often virtex
                    /[\u0E00-\u0E7F]{12,}/.test(text) || // Thai script spam
                    /[\u0300-\u036f]{15,}/.test(text) || // combining diacritics spam
                    (text.match(/[^a-z0-9\s]/gi) || []).length > text.length * 0.7; // mostly special chars

                if (isVirtex) {
                    try {
                        await sock.sendMessage(chat, { delete: m.key });
                        await sock.sendMessage(chat, {
                            text: `🛡️ Antivirus alert: Virtex / crash message detected and deleted!`
                        });
                        // Optional: kick sender (uncomment if you want aggressive mode)
                        // await sock.groupParticipantsUpdate(chat, [sender], 'remove');
                    } catch (err) {
                        console.error('Antivirus delete failed:', err);
                    }
                }
            }
        });

        console.log('[Antivirus] Real-time protection loaded');
    }
};