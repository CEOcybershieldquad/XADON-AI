
module.exports = {
    command: 'slap',
    aliases: ['hit', 'punch'],
    category: 'fun',
    description: 'Slap someone with a fun sticker/message',
    usage: '.slap @user or reply to message',

    execute: async (sock, m, { args, reply }) => {
        try {
            let target = m.pushName || "someone";
            let mentions = [];

            const ctx = m.message?.extendedTextMessage?.contextInfo;
            if (ctx?.mentionedJid?.length > 0) {
                target = `@${ctx.mentionedJid[0].split('@')[0]}`;
                mentions = ctx.mentionedJid;
            } else if (ctx?.participant && m.quoted) {
                target = `@${ctx.participant.split('@')[0]}`;
                mentions = [ctx.participant];
            }

            await sock.sendMessage(m.chat, { react: { text: "👋", key: m.key } });

            const slapMessages = [
                `${target} just got SLAPPED! 💥 Take that!`,
                `*SLAP* ${target} across the face! 😤 Who next?`,
                `${target} ouch! That slap hurt even me watching 😭`,
                `POW! ${target} got slapped into next week 🫢`,
                `${target} caught these hands! 👊🔥`,
                "Slap incoming... *BONK* right on the head!"
            ];

            const randomSlap = slapMessages[Math.floor(Math.random() * slapMessages.length)];

            // Optional: send a slap sticker if you have one uploaded or use webp URL
            // For simplicity, just text + mention (add sticker below if you want)

            await sock.sendMessage(m.chat, {
                text: randomSlap,
                mentions
            }, { quoted: m });

            // Uncomment and add a public slap sticker URL if you want
             await sock.sendMessage(m.chat, { sticker: { url: 'https://apis.prexzyvilla.site/anime/slap' } });

        } catch (err) {
            await extra.reply("Couldn't slap anyone... too weak today 😅");
        }
    }
};