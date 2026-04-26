module.exports = {
    command: 'to-readmore',
    alias: ['rm', 'more'],
    category: 'tools',
    description: 'Create WhatsApp read more text',
    usage: '.to-readmore Hello | Hidden text goes here',
    reactions: {
        start: '📝',
        success: '⚡'
    },

    execute: async (sock, m, { args, reply }) => {

        // Show start reaction
        if (this.reactions?.start) {
            try {
                await sock.sendMessage(m.chat, { react: { text: this.reactions.start, key: m.key } });
            } catch {}
        }

        const text = args.join(' ').trim();
        if (!text.includes('|')) {
            return reply(
`╭─────✰──────────☆──────╮
𖣘 𝐗𝐀𝐃𝐎𝐍 𝐑𝐄𝐀𝐃𝐌𝐎𝐑𝐄 𝐒𝐘𝐒𝐓𝐄𝐌
╰──────✯────────✯──────╯

Usage:
.to-readmore first text | hidden text

Example:
.to-readmore Hi there | This part will be hidden under "Read More"`
            );
        }

        // Split first visible text and hidden text
        const [visibleText, hiddenText] = text.split('|').map(v => v.trim());

        // WhatsApp hidden text trick
        const invisible = String.fromCharCode(8205).repeat(4000); // zero-width joiner

        const message = `${visibleText}\n${invisible}\n${hiddenText}`;

        // Send final message
        await sock.sendMessage(
            m.chat,
            { text: message },
            { quoted: m }
        );

        // Show success reaction
        if (this.reactions?.success) {
            try {
                await sock.sendMessage(m.chat, { react: { text: this.reactions.success, key: m.key } });
            } catch {}
        }
    }
};