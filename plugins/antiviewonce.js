module.exports = {
    command: 'antiviewonce',
    aliases: ['antivo', 'noviewonce'],
    category: 'antis',
    description: 'Toggle anti-viewonce (re-send view-once media so others can see)',
    usage: '.antiviewonce on / off',
    group: true,
    admin: true,

        execute: async (sock, m, { args, reply }) => {
        try {
            if (args.length === 0) {
                const current = global.groupSettings.get(m.chat)?.antiviewonce ? 'on' : 'off';
                return extra.reply(`Anti-viewonce is currently *${current}*.\nUse on / off`);
            }

            const mode = args[0].toLowerCase();
            if (!['on', 'off'].includes(mode)) {
                return extra.reply("Use .antiviewonce on / off");
            }

            if (!global.groupSettings.has(m.chat)) global.groupSettings.set(m.chat, {});
            global.groupSettings.get(m.chat).antiviewonce = mode === 'on';

            await sock.sendMessage(m.chat, {
                text: `📸 Anti-viewonce is now *${mode}*!\nView-once media will be re-sent automatically.`
            }, { quoted: m });

        } catch (err) {
            console.error('Antiviewonce error:', err);
            await extra.reply("❌ Failed to toggle anti-viewonce.");
        }
    }
};