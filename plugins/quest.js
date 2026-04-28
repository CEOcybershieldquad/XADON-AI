const fs = require('fs');

module.exports = {
    command: 'quest',
    alias: ['mission', 'task'],
    description: 'Complete daily quests for bonus rewards',
    category: 'economy',
    usage: '.quest [claim]',

    execute: async (sock, m, { args, reply }) => {

        const ECONOMY_PATH = './database/economy.json';
        const QUEST_PATH = './database/quest.json';

        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        let economy = {};
        let quest = {};

        if (fs.existsSync(ECONOMY_PATH)) {
            economy = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));
        }
        if (fs.existsSync(QUEST_PATH)) {
            quest = JSON.parse(fs.readFileSync(QUEST_PATH, 'utf8'));
        }

        const userId = m.sender;

        if (!economy[userId]) {
            economy[userId] = { wallet: 0, bank: 0, totalEarned: 0 };
        }
        if (!quest[userId]) {
            quest[userId] = { lastReset: 0, completed: [] };
        }

        const user = economy[userId];
        const userQuest = userQuest = quest[userId];

        // ✅ Reset daily at midnight
        const now = Date.now();
        const today = new Date().setHours(0, 0, 0, 0);
        if (userQuest.lastReset < today) {
            userQuest.completed = [];
            userQuest.lastReset = now;
        }

        // ✅ Daily quests
        const quests = [
            { id: 'work1', name: '💼 Work 3 times', reward: 5000, check: () => (user.workCount || 0) >= 3 },
            { id: 'fish5', name: '🎣 Catch 5 fish', reward: 3000, check: () => (user.fishCount || 0) >= 5 },
            { id: 'mine3', name: '⛏️ Mine 3 times', reward: 4000, check: () => (user.mineCount || 0) >= 3 },
            { id: 'earn10k', name: '💰 Earn 10,000 coins', reward: 8000, check: () => (user.dailyEarned || 0) >= 10000 }
        ];

        // ✅ Claim rewards
        if (args[0] === 'claim') {
            let totalReward = 0;
            let claimed = [];

            quests.forEach(q => {
                if (q.check() &&!userQuest.completed.includes(q.id)) {
                    totalReward += q.reward;
                    userQuest.completed.push(q.id);
                    claimed.push(q.name);
                }
            });

            if (totalReward === 0) {
                return reply(`❌ No quests completed\n\nUse.quest to check progress\n\n> ֎`);
            }

            user.wallet += totalReward;
            user.totalEarned += totalReward;

            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
            fs.writeFileSync(QUEST_PATH, JSON.stringify(quest, null, 2));

            return await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • QUEST*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Quests Completed!*

${claimed.map(q => ` • ${q}`).join('\n')}

💰 Reward: ${totalReward.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });
        }

        // ✅ Show quest progress
        let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • DAILY QUESTS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📋 *Today's Missions*

`;
        quests.forEach(q => {
            const done = userQuest.completed.includes(q.id);
            const status = done? '✅' : q.check()? '🎯 Ready!' : '⏳';
            text += `${status} ${q.name}\n`;
            text += ` Reward: ${q.reward.toLocaleString()} coins\n\n`;
        });

        text += `Use.quest claim to get rewards\nResets daily at midnight\n\n> ֎`;

        await sock.sendMessage(m.chat, { text: text }, { quoted: m });

        await sock.sendMessage(m.chat, {
            react: { text: "📋", key: m.key }
        });
    }
};