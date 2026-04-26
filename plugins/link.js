module.exports = {
    command: 'link',
    alias: ['grouplink', 'invitelink'],
    description: 'Get the invite link of the current group',
    category: 'group',
    usage: '.link',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) {
            return reply('❌ This command works only in groups\n> XADON AI');
        }

        try {
            const groupMetadata = await sock.groupMetadata(m.chat);
            
            // Reset link if expired or revoked
            const inviteCode = await sock.groupInviteCode(m.chat);
            const groupLink = `https://chat.whatsapp.com/${inviteCode}`;

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • GROUP LINK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔗 *Group Name:* ${groupMetadata.subject}

✅ Here is the invite link:

${groupLink}

⚡ Anyone with this link can join

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "🔗", key: m.key }
            });

        } catch (err) {
            console.error('[LINK ERROR]', err?.message || err);

            let msg = '❌ Failed to get group link\n\n';

            const errorText = (err.message || '').toLowerCase();

            if (errorText.includes('not-authorized') || errorText.includes('admin')) {
                msg += '• Bot must be an admin to generate link';
            } else if (errorText.includes('revoked') || errorText.includes('invalid')) {
                msg += '• Link was revoked. Try again.';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};