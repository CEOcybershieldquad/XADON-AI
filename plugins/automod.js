let automod = {}

module.exports = {
    command: 'automod',

    execute: async (sock, m, { args, reply }) => {

        const state = args[0]

        if (state === 'on') automod[m.chat] = true
        else if (state === 'off') automod[m.chat] = false

        reply(`╔═══════════════════════╗
   ✦ *XADON AI • AUTOMOD* ✦
╚═══════════════════════╝

🛡️ Status: ${automod[m.chat] ? 'Enabled' : 'Disabled'}

> XADON AI`)
    }
}