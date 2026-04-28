const fs = require('fs');

module.exports = {
    command: 'farm',
    alias: ['farming', 'plant', 'harvest'],
    description: 'Farm crops to earn coins',
    category: 'economy',
    usage: '.farm [crop]',
    cooldown: 5,

    execute: async (sock, m, { args, reply }) => {

        const ECONOMY_PATH = './database/economy.json';
        const FARM_PATH = './database/farm.json';

        // ✅ Create database folder if missing
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        // ✅ Load or create economy DB
        let economy = {};
        if (fs.existsSync(ECONOMY_PATH)) {
            economy = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));
        }

        // ✅ Load or create farm DB
        let farm = {};
        if (fs.existsSync(FARM_PATH)) {
            farm = JSON.parse(fs.readFileSync(FARM_PATH, 'utf8'));
        }

        const userId = m.sender;

        // ✅ Create user if new
        if (!economy[userId]) {
            economy[userId] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                totalEarned: 0
            };
        }

        if (!farm[userId]) {
            farm[userId] = {
                crops: {},
                plots: 3
            };
        }

        const user = economy[userId];
        const userFarm = farm[userId];

        // ✅ Crop types
        const crops = {
            wheat: { name: '🌾 Wheat', growTime: 5 * 60 * 1000, sell: 120, seed: 20 },
            carrot: { name: '🥕 Carrot', growTime: 10 * 60 * 1000, sell: 250, seed: 50 },
            corn: { name: '🌽 Corn', growTime: 15 * 60 * 1000, sell: 400, seed: 80 },
            tomato: { name: '🍅 Tomato', growTime: 20 * 60 * 1000, sell: 600, seed: 120 },
            cassava: { name: '🥔 Cassava', growTime: 30 * 60 * 1000, sell: 1000, seed: 200 }
        };

        // ✅ Show farm status if no args
        if (!args[0]) {
            let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • FARM*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌱 *Your Farm* (${Object.keys(userFarm.crops).length}/${userFarm.plots} plots)

`;

            const now = Date.now();
            if (Object.keys(userFarm.crops).length === 0) {
                text += `Empty farm! Plant something\n`;
            } else {
                Object.keys(userFarm.crops).forEach((plotId, i) => {
                    const crop = userFarm.crops[plotId];
                    const cropData = crops[crop.type];
                    const timeLeft = crop.planted + cropData.growTime - now;

                    if (timeLeft <= 0) {
                        text += `Plot ${i + 1}: ${cropData.name} ✅ Ready!\n`;
                    } else {
                        const mins = Math.floor(timeLeft / 60000);
                        const secs = Math.floor((timeLeft % 60000) / 1000);
                        text += `Plot ${i + 1}: ${cropData.name} ⏳ ${mins}m ${secs}s\n`;
                    }
                });
                text += `\n`;
            }

            text += `*Available Crops:*\n`;
            Object.keys(crops).forEach(id => {
                const c = crops[id];
                text += `${c.name} - Seed: ${c.seed} | Sell: ${c.sell} | ${c.growTime/60000}min\n`;
            });

            text += `\nUsage:.farm <crop> to plant\n.farm harvest to collect\n\n💵 Wallet: ${user.wallet.toLocaleString()}\n\n> ֎`;

            return await sock.sendMessage(m.chat, { text: text }, { quoted: m });
        }

        const action = args[0].toLowerCase();

        // ✅ Harvest
        if (action === 'harvest') {
            const now = Date.now();
            let totalEarned = 0;
            let harvested = [];

            Object.keys(userFarm.crops).forEach(plotId => {
                const crop = userFarm.crops[plotId];
                const cropData = crops[crop.type];

                if (now - crop.planted >= cropData.growTime) {
                    totalEarned += cropData.sell;
                    harvested.push(cropData.name);
                    delete userFarm.crops[plotId];
                }
            });

            if (harvested.length === 0) {
                return reply(`❌ No crops ready to harvest\n\nCheck.farm to see timers\n\n> ֎`);
            }

            user.wallet += totalEarned;
            user.totalEarned += totalEarned;

            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
            fs.writeFileSync(FARM_PATH, JSON.stringify(farm, null, 2));

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • FARM*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌾 *Harvest Complete!*

🥕 Crops: ${harvested.join(', ')}
💰 Earned: ${totalEarned.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });

            return await sock.sendMessage(m.chat, {
                react: { text: "🌾", key: m.key }
            });
        }

        // ✅ Plant crop
        if (!crops[action]) {
            return reply(`❌ Invalid crop\n\nAvailable: wheat, carrot, corn, tomato, cassava\n\n> ֎`);
        }

        // ✅ Check plot space
        if (Object.keys(userFarm.crops).length >= userFarm.plots) {
            return reply(`❌ Farm is full!\n\nHarvest with.farm harvest\n\n> ֎`);
        }

        const cropData = crops[action];

        // ✅ Check if user can afford seed
        if (user.wallet < cropData.seed) {
            return reply(`❌ Not enough coins for seeds\n\nCost: ${cropData.seed} coins\n💵 Wallet: ${user.wallet.toLocaleString()}\n\n> ֎`);
        }

        // ✅ Plant
        user.wallet -= cropData.seed;
        const plotId = Date.now().toString();
        userFarm.crops[plotId] = {
            type: action,
            planted: Date.now()
        };

        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
        fs.writeFileSync(FARM_PATH, JSON.stringify(farm, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • FARM*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌱 *Planted ${cropData.name}!*

💸 Seed cost: ${cropData.seed} coins
⏳ Grow time: ${cropData.growTime / 60000} minutes
💰 Sell value: ${cropData.sell} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins

Use.farm harvest when ready

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        await sock.sendMessage(m.chat, {
            react: { text: "🌱", key: m.key }
        });
    }
};