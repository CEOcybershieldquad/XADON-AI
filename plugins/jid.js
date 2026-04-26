module.exports = {
    command: 'jid',
    alias: ['id', 'getjid', 'whatsappid'],
    description: 'Get JID of user, group, channel or number',
    category: 'group',
    usage: '.jid | .jid <number> | .jid <link> | reply to anyone/link',

    execute: async (sock, m, { args, reply }) => {
        if (!m.isGroup && !m.isPrivate) {
            return reply('❌ This command works in groups and private chat\n> XADON AI');
        }

        let targetJid = null;
        let source = '';

        // ==================== 1. REPLY TO MESSAGE ====================
        if (m.quoted) {
            // Direct sender (user message or channel post)
            if (m.quoted.sender) {
                targetJid = m.quoted.sender;
                source = 'reply';
            }

            // If no sender or link in quoted text, try to extract link
            if (!targetJid) {
                const quotedText = 
                    m.quoted.message?.conversation ||
                    m.quoted.message?.extendedTextMessage?.text ||
                    m.quoted.message?.imageMessage?.caption ||
                    m.quoted.message?.videoMessage?.caption ||
                    '';

                if (quotedText) {
                    targetJid = parseLink(quotedText);
                    source = targetJid ? 'quoted_link' : '';
                }
            }
        }

        // ==================== 2. COMMAND ARGUMENTS ====================
        if (!targetJid) {
            const text = args.join(' ').trim();

            if (text) {
                // Check if it's a phone number
                let number = text.replace(/[^0-9]/g, '');

                if (number.length >= 10) {
                    // Auto-fix Nigerian numbers (same as promote/demote)
                    if (number.length === 10) number = '234' + number;
                    else if (number.startsWith('0')) number = '234' + number.slice(1);

                    targetJid = number + '@s.whatsapp.net';
                    source = 'number';
                } 
                // Check for WhatsApp links
                else {
                    targetJid = parseLink(text);
                    source = targetJid ? 'link' : '';
                }
            }
            // No args + inside group = current group JID
            else if (m.isGroup) {
                targetJid = m.chat;
                source = 'current_group';
            }
        }

        // ==================== 3. NO INPUT → HELP ====================
        if (!targetJid) {
            return reply(`✨ ✪ *XADON AI • JID EXTRACTOR* ✪ ✨

🔍 Get JID instantly:

• Reply to user → .jid
• Number → .jid 234xxxxxxxxxx
• Group link → .jid https://chat.whatsapp.com/...
• Channel link → .jid https://whatsapp.com/channel/...
• In any group → just .jid

> XADON AI`);
        }

        // ==================== 4. FORMAT OUTPUT ====================
        let info = '';

        if (targetJid.endsWith('@s.whatsapp.net')) {
            const num = targetJid.split('@')[0];
            info = `📱 *Phone Number:* +${num}\n🔑 *User JID:* ${targetJid}`;
        } 
        else if (targetJid.endsWith('@g.us')) {
            info = `👥 *Group JID:* ${targetJid}`;
        } 
        else if (targetJid.endsWith('@newsletter')) {
            info = `📢 *Channel JID:* ${targetJid}`;
        } 
        else {
            info = `🔑 *JID:* ${targetJid}`;
        }

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • JID INFO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

${info}

🔍 Source: ${source === 'reply' ? 'Replied message' : 
            source === 'number' ? 'Phone number' : 
            source === 'current_group' ? 'Current group' : 'Link'}

> XADON AI`
        });

        await sock.sendMessage(m.chat, {
            react: { text: "🔑", key: m.key }
        });
    }
};

// Helper function to parse group or channel links
function parseLink(text) {
    // Group invite link
    const groupMatch = text.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]{20,25})/i);
    if (groupMatch) {
        // We cannot get real group JID from invite link (WhatsApp privacy)
        return null; // will be handled in main code
    }

    // Channel link
    const channelMatch = text.match(/(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i);
    if (channelMatch && channelMatch[1]) {
        return channelMatch[1] + '@newsletter';
    }

    return null;
}