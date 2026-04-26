const { getEconomy, saveEconomy } = require('../Handlers/economy.js')

module.exports = {
    command: 'work',
    alias: [],
    description: 'Work to earn some money',
    category: 'economy',
    usage: '.work',

    execute: async (sock, m, { reply }) => {

        let db = getEconomy()
        const userId = m.sender

        // Initialize user if not exist
        if (!db[userId]) {
            db[userId] = {
                naira: 5000,
                usd: 50,
                inventory: {}
            }
        }

        const user = db[userId]

        // Random earning amounts
        const nairaEarned = Math.floor(Math.random() * 500) + 100   // ₦100 - ₦600
        const usdEarned = Math.floor(Math.random() * 10) + 1        // $1 - $10

        user.naira += nairaEarned
        user.usd += usdEarned

        saveEconomy(db)

        reply(`╔═══════════════════════╗
   Work Result
╚═══════════════════════╝

💰 You worked hard and earned:
• Naira: ₦${nairaEarned.toLocaleString()}
• USD: $${usdEarned.toLocaleString()}

📦 Your new balance:
• Naira: ₦${user.naira.toLocaleString()}
• USD: $${user.usd.toLocaleString()}

> Xadon Ai`)
    }
}