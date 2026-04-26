module.exports = {
    command: 'groupinfo',
    aliases: ['ginfo', 'info', 'gcinfo'],
    category: 'group',
    description: 'Show detailed information about the group',
    usage: '.groupinfo',
    group: true,

    async execute(sock, m, args, extra) {
        try {
            await sock.sendMessage(m.chat, { react: { text: "ℹ️", key: m.key } });

            const metadata = await sock.groupMetadata(m.chat);

            const creationDate = new Date(metadata.creation * 1000).toLocaleString();
            const owner = metadata.owner ? `@${metadata.owner.split('@')[0]}` : 'Unknown';
            const participantsCount = metadata.participants.length;
            const adminsCount = metadata.participants.filter(p => p.admin).length;

            const desc = metadata.desc || 'No description set.';
            const isLocked = metadata.announce ? '🔒 Yes (muted)' : '🔓 No (open)';

            let text = `*Group Information*\n\n`;
            text += `📛 *Name*: ${metadata.subject}\n`;
            text += `🆔 *ID*: ${m.chat.split('@')[0]}\n`;
            text += `👑 *Owner*: ${owner}\n`;
            text += `📅 *Created*: ${creationDate}\n`;
            text += `👥 *Members*: ${participantsCount}\n`;
            text += `🛡️ *Admins*: ${adminsCount}\n`;
            text += `🔗 *Locked*: ${isLocked}\n`;
            text += `📝 *Description*:\n${desc}\n`;
            text += `> 🤖 *XADON AI* 🤖` 

            await sock.sendMessage(m.chat, { text }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (err) {
            console.error('Groupinfo error:', err);
            await extra.reply("❌ Failed to fetch group info.");
            await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        }
    }
};