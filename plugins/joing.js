module.exports = {
    command: 'join',
    alias: ['joinlink', 'join group'],
    description: 'Join a WhatsApp group using invite link',
    category: 'group',
    usage: '.join <grouplink> or reply to any message containing the link',

    execute: async (sock, m, { args, reply }) => {
        
        let linkText = args.join(' ').trim();

        // ✅ Support replying to a message that contains the link
        if (!linkText && m.quoted) {
            const quotedMsg = m.quoted.message;
            linkText = 
                quotedMsg?.conversation ||
                quotedMsg?.extendedTextMessage?.text ||
                quotedMsg?.imageMessage?.caption ||
                quotedMsg?.videoMessage?.caption ||
                '';
        }

        if (!linkText) {
            return reply(`✨ ✪ *XADON AI • JOIN GROUP* ✪ ✨

🔗 How to join a group:

• Paste link → .join https://chat.whatsapp.com/ABC123XYZ
• Reply to link → just reply to any message with the group link + .join

> XADON AI`);
        }

        // Extract invite code from any format
        const regex = /chat\.whatsapp\.com\/([a-zA-Z0-9]{20,25})/i;
        const match = linkText.match(regex);

        if (!match || !match[1]) {
            return reply('❌ Invalid WhatsApp group link!\n\nMake sure the link is in this format:\nhttps://chat.whatsapp.com/ABC123XYZ\n> XADON AI');
        }

        const inviteCode = match[1];

        await reply(`⏳ Joining group...\nPlease wait\n> XADON AI`);

        try {
            await sock.groupAcceptInvite(inviteCode);

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • GROUP JOINED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Successfully joined the group!

🔗 Link: https://chat.whatsapp.com/${inviteCode}

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "✅", key: m.key }
            });

        } catch (err) {
            console.error('[JOIN ERROR]', err?.message || err);

            let msg = '❌ Failed to join group\n\n';

            const errorText = (err.message || '').toLowerCase();

            if (errorText.includes('invalid') || errorText.includes('not found') || errorText.includes('400')) {
                msg += '• Invalid or expired group link';
            } else if (errorText.includes('already') || errorText.includes('participant')) {
                msg += '• You are already in this group';
            } else if (errorText.includes('full') || errorText.includes('maximum')) {
                msg += '• Group is full';
            } else if (errorText.includes('unauthorized') || errorText.includes('forbidden')) {
                msg += '• Cannot join (link may be private or revoked)';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};