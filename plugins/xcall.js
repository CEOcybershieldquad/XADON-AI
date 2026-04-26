module.exports = {
    command: 'xcall',
    alias: ['phone', 'dial', 'ring'],
    description: 'Create a WhatsApp call button',
    category: 'tools',
    usage: '.call <number> | <text>',

    execute: async (sock, m, { args, reply, prefix }) => {
        const fullText = args.join(' ').trim();

        if (!fullText) {
            return reply(`֎ ✪ *XADON AI • CALL BUTTON* ✪ ֎

📞 Usage:.call <number> | <text>

Examples:
-.xcall 2348077528901 | Call CRYSNOVA
-.xcall 2348012345678 | Support

💡 Tap button to start WhatsApp call

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '📞', key: m.key } });

        // Parse number and text
        const parts = fullText.split('|').map(p => p.trim());
        let phoneNumber = parts[0] || '';
        const displayText = parts[1] || 'Call Now';

        // Clean phone number - remove +, spaces, dashes, parentheses
        phoneNumber = phoneNumber.replace(/[+\s\-()]/g, '');

        if (!phoneNumber ||!/^\d{10,15}$/.test(phoneNumber)) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply('❌ Invalid phone number\n\n• Must be 10-15 digits\n• No country code + needed\n• Example: 2348012345678\n\n> ֎');
        }

        try {
            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • WHATSAPP CALL*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📞 ${displayText}
🔢 +${phoneNumber}

💡 Tap button to call via WhatsApp

> ֎`,
                nativeFlow: [{
                    text: `📞 ${displayText}`,
                    call: phoneNumber
                }]
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[CALL ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to create call button\n\n';

            if (err.message?.includes('nativeFlow')) {
                msg += '• WhatsApp version may not support call buttons';
            } else {
                msg += '• Try again or use different number';
            }

            reply(msg + '\n\n📞 Fallback: wa.me/' + phoneNumber + '\n\n> ֎');
        }
    }
};