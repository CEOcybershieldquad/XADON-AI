module.exports = {
    command: 'roast',
    aliases: ['burn', 'insult'],
    category: 'fun',
    description: 'Roast someone (mention or reply)',
    usage: '.roast @user or .roast (yourself)',

    async execute(sock, m, args, extra) {
        try {
            let target = "yourself";
            let mentions = [];

            const ctx = m.message?.extendedTextMessage?.contextInfo;
            if (ctx?.mentionedJid?.length > 0) {
                target = `@${ctx.mentionedJid[0].split('@')[0]}`;
                mentions = ctx.mentionedJid;
            } else if (ctx?.participant && m.quoted) {
                target = `@${ctx.participant.split('@')[0]}`;
                mentions = [ctx.participant];
            }

            const roasts = [
                `${target} looks like they were dropped on their head as a baby... repeatedly.`,
                `${target} has the personality of a wet sock.`,
                `${target} is the human version of a participation trophy.`,
                `${target} couldn't get a date if they were the last person on Earth... and even then, Earth would say no.`,
                `${target} is proof that evolution can go in reverse.`,
                `${target} brings nothing to the table except an appetite.`,
                "Bro really thought he ate... but the plate said 'nah I'm good' 💀"
            ];

            const roast = roasts[Math.floor(Math.random() * roasts.length)];

            await sock.sendMessage(m.chat, {
                text: roast,
                mentions
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: "🔥", key: m.key } });

        } catch (err) {
            await extra.reply("Roast failed... maybe you're too nice 😇");
        }
    }
};