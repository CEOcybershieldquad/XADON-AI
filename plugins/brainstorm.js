const fs = require('fs');

module.exports = {
    command: 'brainstorm',
    alias: ['idea', 'think'],
    description: 'Brainstorm ideas - win coins if lucky',
    category: 'economy',
    usage: '.brainstorm <topic>',
    cooldown: 10,

    execute: async (sock, m, { args, reply }) => {

        const ECONOMY_PATH = './database/economy.json';

        // ✅ Create database folder if missing
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        // ✅ Load or create economy DB
        let economy = {};
        if (fs.existsSync(ECONOMY_PATH)) {
            economy = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));
        }

        const userId = m.sender;

        // ✅ Create user if new
        if (!economy[userId]) {
            economy[userId] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                lastBrainstorm: 0,
                totalEarned: 0
            };
        }

        const user = economy[userId];

        // ✅ Check brainstorm cooldown: 5 minutes
        const now = Date.now();
        const brainstormCooldown = 5 * 60 * 1000;
        if (now - (user.lastBrainstorm || 0) < brainstormCooldown) {
            const timeLeft = brainstormCooldown - (now - user.lastBrainstorm);
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
            return reply(`🧠 Brain is recharging!\n\nCooldown: ${minutes}m ${seconds}s\n\n> ֎`);
        }

        if (!args[0]) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • BRAINSTORM*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🧠 Get random ideas on any topic
💡 If you win, you get credited
😅 If you lose, nothing happens

Usage:
.brainstorm <topic>

Example:
.brainstorm science
.brainstorm business
.brainstorm coding

*It's for fun ooh* 😀😀

> ֎`);
        }

        const topic = args.join(' ').toLowerCase();

        // ✅ Ideas database
        const ideas = {
            science: [
                'Build a solar-powered phone charger',
                'Create biodegradable plastic from cassava',
                'Invent a water filter using charcoal',
                'Design a drone for farming',
                'Make a weather app for farmers'
            ],
            business: [
                'Start a WhatsApp bot service',
                'Sell thrift clothes online',
                'Open a mini food delivery',
                'Create online coding tutorials',
                'Sell custom phone cases'
            ],
            coding: [
                'Build a WhatsApp economy bot',
                'Make a school result checker',
                'Create a crypto price tracker',
                'Design a todo list app',
                'Build an AI chatbot'
            ],
            art: [
                'Draw Lagos in anime style',
                'Design NFT collection',
                'Create WhatsApp stickers',
                'Paint with coffee',
                'Make digital comics'
            ],
            random: [
                'Invent edible shoes',
                'Build a house on water',
                'Train fish to play football',
                'Make a clock that runs backwards',
                'Create invisible clothes'
            ]
        };

        // ✅ Get idea list
        const topicIdeas = ideas[topic] || ideas['random'];
        const idea = topicIdeas[Math.floor(Math.random() * topicIdeas.length)];

        // ✅ 35% chance to win coins - if you lose nothing happens
        const win = Math.random() < 0.35;
        user.lastBrainstorm = now;

        if (win) {
            // Win: 100-500 coins
            const reward = Math.floor(Math.random() * 401) + 100;
            user.wallet += reward;
            user.totalEarned += reward;

            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • BRAINSTORM*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🧠 *Topic: ${topic}*

💡 *Idea:* ${idea}

🎉 *You got credited!*
💰 Reward: +${reward.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins

*It's for fun ooh* 😀😀

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });

            await sock.sendMessage(m.chat, {
                react: { text: "💡", key: m.key }
            });

        } else {
            // Lose: nothing happens, no coins lost
            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • BRAINSTORM*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🧠 *Topic: ${topic}*

💡 *Idea:* ${idea}

😅 No reward this time
💵 Wallet: ${user.wallet.toLocaleString()} coins

Nothing happens if you lose ✅
*It's for fun ooh* 😀😀

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });

            await sock.sendMessage(m.chat, {
                react: { text: "🧠", key: m.key }
            });
        }
    }
};