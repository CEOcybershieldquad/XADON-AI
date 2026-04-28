const { getEconomy, saveEconomy } = require('../Handlers/economy.js')

module.exports = {
    command: 'balance',
    alias: ['bal'],
    description: 'Check your economy balance',
    category: 'economy',
    usage: '.balance',

    execute: async (sock, m, { reply }) => {

        let db = getEconomy()
        const userId = m.sender

        // Initialize user if not exist
        if (!db[userId]) {
            db[userId] = {
                naira: 5000, // default starting balance NGN
                usd: 50,     // default starting balance USD
                inventory: {}
            }
            saveEconomy(db)
        }

        const user = db[userId]

        reply(`╔═══════════════════════╗
   ✦ *XADON AI • ECONOMY* ✦
╚═══════════════════════╝

💰 *Your Balance:*
• 🇳🇬 Naira: ₦${user.naira.toLocaleString()}
• 🇺🇸 USD: $${user.usd.toLocaleString()}

📦 Inventory: ${Object.keys(user.inventory).length || 'Empty'}

> XADON AI`)
    }
}