module.exports = {
    command: 'dice',
    alias: ['roll'],
    description: 'Roll a dice',
    category: 'fun',
    execute: async (sock, m, { reply }) => {
        const result = Math.floor(Math.random() * 6) + 1;
        const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        await reply(`🎲 You rolled: *${result}* ${faces[result]}`);
    }
};
