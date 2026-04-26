if (!global.groupSettings) global.groupSettings = new Map();

module.exports = {
    command: 'antibug',
    aliases: ['antivirtex', 'bugrepel', 'antivirus'],
    category: 'antis',
    description: 'Toggle anti-bug/virtex (delete crash messages)',
    usage: '.antibug on / off',
    group: true,
    admin: true,
    botAdminNeeded: true,

    async execute(sock, m, args, extra) {
        if (args.length === 0) {
            const status = global.groupSettings.get(m.chat)?.antibug ? 'ON' : 'OFF';
            return extra.reply(`Antibug is currently *${status}*.\nUse .antibug on / off`);
        }

        const mode = args[0].toLowerCase();
        if (!['on', 'off'].includes(mode)) return extra.reply('Use on / off');

        if (!global.groupSettings.has(m.chat)) global.groupSettings.set(m.chat, {});
        global.groupSettings.get(m.chat).antibug = mode === 'on';

        await extra.reply(`Antibug protection is now *${mode}*!\nVirtex/crash messages will be deleted.`);
    },

    initAnti(sock) {
        const VIR TEX_PATTERNS = ['๒๒๒', 'ดุ', 'ผิดุท้เึางื', 'ฆู้้', '่้้', '็', 'ิ้', 'ุ', 'ํ', '๋'];

        sock.ev.on('messages.upsert', async (upsert) => {
            if (upsert.type !== 'notify') return;

            for (const m of upsert.messages) {
                if (m.key.fromMe) continue;
                const chat = m.key.remoteJid;
                if (!chat?.endsWith('@g.us')) continue;

                const settings = global.groupSettings.get(chat) || {};
                if (!settings.antibug) continue;

                let text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
                if (!text) continue;
                text = text.toLowerCase();

                const isVirtex =
                    VIR_TEX_PATTERNS.some(p => text.includes(p)) ||
                    text.length > 3500 ||
                    /[\u0E00-\u0E7F]{10,}/.test(text);

                if (isVirtex) {
                    try {
                        await sock.sendMessage(chat, { delete: m.key });
                        await sock.sendMessage(chat, { text: '🛡️ Virtex / bug message removed' });
                    } catch {}
                }
            }
        });
        console.log('[Antibug] Protection loaded');
    }
};