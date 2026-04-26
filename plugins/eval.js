module.exports = {
    command: 'eval',
    alias: ['ev', '>'],
    description: 'Execute JavaScript code',
    category: 'owner',
    ownerOnly: true,
    execute: async (sock, m, { text, reply }) => {
        if (!text) return reply('Usage: .eval <code>');
        try {
            const res = await eval(text);
            const out = typeof res === 'object' ? JSON.stringify(res, null, 2) : String(res);
            await reply(`✅ Result:\n\`\`\`\n${out}\n\`\`\``);
        } catch (e) {
            await reply(`❌ Error:\n\`\`\`\n${e.message}\n\`\`\``);
        }
    }
};
