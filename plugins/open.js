module.exports = {
    command: 'open',
    alias: ['view', 'website', 'url'],
    description: 'Create a website button that opens in-app',
    category: 'tools',
    usage: '.open <link> | <button text>',

    execute: async (sock, m, { args, reply, prefix }) => {
        const fullText = args.join(' ').trim();

        if (!fullText) {
            return reply(`֎ ✪ *XADON AI • WEBSITE BUTTON* ✪ ֎

🌐 Usage:.open <link> | <button text>

Examples:
-.open https://crysnovax.link | Visit Site
-.open https://youtube.com | Watch Video
-.open google.com | Search

💡 Opens in WhatsApp's in-app browser

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🌐', key: m.key } });

        const parts = fullText.split('|').map(p => p.trim());
        let url = parts[0] || '';
        const buttonText = parts[1] || '🌐 Open Link';

        // Validate URL
        if (!url.startsWith('http://') &&!url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            // Validate URL format
            new URL(url);

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • WEB LINK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌐 ${buttonText}

💡 Opens in WhatsApp browser

> ֎`,
                nativeFlow: [{
                    text: buttonText,
                    url: url,
                    useWebview: true
                }]
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[OPEN ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Invalid link\n\n';

            if (err.message?.includes('Invalid URL')) {
                msg += '• Check the URL format\n• Example: https://google.com';
            } else {
                msg += '• Failed to create button';
            }

            reply(msg + '\n\n🔗 Fallback: ' + url + '\n\n> ֎');
        }
    }
};