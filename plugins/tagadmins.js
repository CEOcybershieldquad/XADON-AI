module.exports = {
    command: 'tagadmins',
    aliases: ['listadmins'],
    description: 'List group admins, highlighting super admins',
    category: 'group',
    usage: '.admins',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) return reply('❌ This command works only in groups\n> XADON AI');

        try {
            const metadata = await sock.groupMetadata(m.chat);
            const allAdmins = metadata.participants.filter(p => p.admin !== null);
            const superAdmins = allAdmins.filter(a => a.admin === 'superadmin');
            const regularAdmins = allAdmins.filter(a => a.admin !== 'superadmin');

            let text = `✨ ✪ *Group Admins* ✪ ✨\n\n`;

            if (superAdmins.length) {
                text += `🌟 *Super Admins*:\n${superAdmins.map((a,i) => `${i+1}. @${a.id.split('@')[0]}`).join('\n')}\n\n`;
            }

            if (regularAdmins.length) {
                text += `⚡ *Admins*:\n${regularAdmins.map((a,i) => `${i+1}. @${a.id.split('@')[0]}`).join('\n')}\n\n`;
            }

            text += `> Total Admins: ${allAdmins.length}\n> XADON AI`;

            await sock.sendMessage(m.chat, {
                text,
                mentions: allAdmins.map(a => a.id)
            });

        } catch (err) {
            console.error('[ADMINS ERROR]', err?.message || err);
            reply('⚠️ Failed to fetch admins\n> XADON AI');
        }
    }
};