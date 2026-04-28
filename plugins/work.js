const fs = require('fs');

module.exports = {
    command: 'work',
    alias: ['job', 'grind', 'earn'],
    description: 'Work to earn coins',
    category: 'economy',
    usage: '.work',
    cooldown: 5,

    execute: async (sock, m, { reply }) => {

        const ECONOMY_PATH = './database/economy.json';

        // ✅ Create database folder if missing
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        // ✅ Load or create economy DB
        let db = {};
        if (fs.existsSync(ECONOMY_PATH)) {
            db = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));
        }

        const userId = m.sender;

        // ✅ Create user if new
        if (!db[userId]) {
            db[userId] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                totalEarned: 0
            };
        }

        const user = db[userId];
        const now = Date.now();
        const cooldown = 10 * 60 * 1000; // 10 minutes

        // ✅ Check cooldown
        if (now - user.lastWork < cooldown) {
            const timeLeft = cooldown - (now - user.lastWork);
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

            return reply(`😮‍💨 You are tired!\n\nRest for: ${minutes}m ${seconds}s\n\n> ֎`);
        }

        // ✅ Random jobs with rewards
        const jobs = [
            { name: 'Programmer', pay: [200, 400], msg: 'You fixed bugs in XADON AI code' },
            { name: 'Chef', pay: [150, 350], msg: 'You cooked jollof rice for customers' },
            { name: 'Taxi Driver', pay: [100, 300], msg: 'You drove passengers around Lagos' },
            { name: 'Streamer', pay: [250, 500], msg: 'You streamed games and got donations' },
            { name: 'Miner', pay: [180, 380], msg: 'You mined crypto coins in the cave' },
            { name: 'Teacher', pay: [120, 320], msg: 'You taught students about AI' },
            { name: 'YouTuber', pay: [300, 600], msg: 'Your video went viral on YouTube' },
            { name: 'Trader', pay: [50, 800], msg: 'You traded crypto and got lucky' },
            { name: 'Hacker', pay: [400, 700], msg: 'You found a bug bounty' },
            { name: 'Artist', pay: [150, 450], msg: 'You sold your NFT art piece' }
        ];

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const earned = Math.floor(Math.random() * (job.pay[1] - job.pay[0] + 1)) + job.pay[0];

        // ✅ Update user
        user.wallet += earned;
        user.lastWork = now;
        user.totalEarned += earned;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(db, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • WORK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

💼 *Job:* ${job.name}
📝 ${job.msg}

💰 *Earned:* ${earned.toLocaleString()} coins
💵 *Wallet:* ${user.wallet.toLocaleString()} coins

Come back in 10 minutes!

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "💼", key: m.key }
        });
    }
};