module.exports = {
    command: 'resetlink',
    alias: ['relink', 'resetgroup', 'revokelink'],
    description: 'Reset WhatsApp group invite link with preview',
    category: 'group',
    usage: '.resetlink',

    execute: async (sock, m, { reply, isAdmin, isBotAdmin }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        if (!isAdmin)
            return reply('❌ Only group admins can use this command\n> XADON AI');

        if (!isBotAdmin)
            return reply('❌ I need to be admin to reset the group link\n> XADON AI');

        await sock.sendMessage(m.chat, {
            react: { text: "🔄", key: m.key }
        });

        try {

            // Reset the group invite link
            await sock.groupRevokeInvite(m.chat);

            // Get the new invite code
            const code = await sock.groupInviteCode(m.chat);
            const newLink = `https://chat.whatsapp.com/${code}`;

            // Get group metadata
            const metadata = await sock.groupMetadata(m.chat);

            // Get group icon URL
            let iconUrl = null;
            try {
                iconUrl = await sock.profilePictureUrl(m.chat, 'image');
            } catch {}

            await sock.sendMessage(
                m.chat,
                {
                    text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *XADON AI • RESET LINK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔗 Group link has been reset

${newLink}

⚡ Old link is now invalid

> XADON AI`,
                    contextInfo: {
                        externalAdReply: {
                            title: metadata.subject,
                            body: "Tap to open new group invite",
                            sourceUrl: newLink,
                            thumbnailUrl: iconUrl || undefined,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            showAdAttribution: false
                        }
                    }
                },
                { quoted: m }
            );

            await sock.sendMessage(m.chat, {
                react: { text: "✅", key: m.key }
            });

        } catch (err) {

            console.error('[RESETLINK ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

            let msg = '❌ Failed to reset group link\n\n';

            if (err.message?.includes('not-authorized') || err.message?.includes('admin')) {
                msg += '• Bot needs admin rights';
            } else if (err.message?.includes('rate')) {
                msg += '• Rate limit - try again later';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};