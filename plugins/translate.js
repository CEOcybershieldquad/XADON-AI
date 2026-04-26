const { translate } = require('../Core/✐.js');

module.exports = {
    command: 'tr',
    alias: ['translate', 'trans'],
    description: 'Translate text to any language',
    category: 'tools',
    usage: '.tr <lang> [text] or reply to a message',

    execute: async (sock, m, { reply, args }) => {
        const lang = args[0]?.toLowerCase();

        if (!lang) {
            return reply(`֎ ✪ *XADON AI • TRANSLATOR* ✪ ֎

🌐 Usage:.tr <lang> [text]

Examples:
-.tr en Hello world
-.tr fr Bonjour
-.tr yo (reply to message)
-.tr es How are you

💡 Supports 100+ languages

> ֎`);
        }

        const text = args.slice(1).join(' ') || m.quoted?.text || '';
        if (!text) {
            return reply('❌ No text found. Type after language or reply to message\n> ֎');
        }

        await sock.sendMessage(m.chat, { react: { text: '🌐', key: m.key } });

        try {
            const { translated, from } = await translate(text, lang);

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • TRANSLATION*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📤 From: ${from.toUpperCase()}
📥 To: ${lang.toUpperCase()}

📝 Original:
${text.length > 300? text.slice(0, 297) + '...' : text}

✅ Translated:
${translated}

💡 Set default:.settrd ${lang}

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[TR ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Translation failed\n\n';

            if (err.message?.includes('invalid')) {
                msg += '• Invalid language code. Use: en, fr, es, ar, yo, etc';
            } else if (err.message?.includes('timeout')) {
                msg += '• Request timed out. Try again';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n\n> ֎');
        }
    }
};