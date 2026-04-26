
module.exports = {
    command: 'meme',
    aliases: ['memes', 'funmeme'],
    category: 'fun',
    description: 'Send a random funny meme (text-based or image if you add API)',
    usage: '.meme',

    async execute(sock, m, args, extra) {
        try {
            await sock.sendMessage(m.chat, { react: { text: "😂", key: m.key } });

            const memes = [
                "When you realize it's Monday tomorrow 😭",
                "Me trying to adult: *confused screaming*",
                "Programmers be like: It works on my machine 🖥️💀",
                "When the group chat goes silent after you send a voice note",
                "Expectation vs Reality: *shows perfect life vs real chaos*",
                "Why do Java developers wear glasses? Because they don't C# 😎"
            ];

            const randomMeme = memes[Math.floor(Math.random() * memes.length)];

            await sock.sendMessage(m.chat, {
                text: `😂 *Random Meme*\n\n${randomMeme}`,
            }, { quoted: m });

        } catch (err) {
            await extra.reply("Couldn't fetch a meme right now 😅");
        }
    }
};