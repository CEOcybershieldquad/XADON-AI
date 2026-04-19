
// 漏𖣘 2026 𝐌𝐔𝐒𝐓𝐄𝐐𝐄𝐄𝐌. All Rights Reserved.
// respect the work, don鈥檛 just copy-paste.

const fs = require('fs')

const config = {
    owner: "Musteqeem",
    botNumber: "2349027879263",
    setPair: "K0MRAID1",
    thumbUrl: "https://files.catbox.moe/bkvkel.jpeg",
    session: "sessions",
    status: {
        private: true,
        terminal: true,
        reactsw: false
    },
    message: {
        owner: "𝐍o, this is for owners only, 𝐁𝐲 𝐌𝐮𝐬𝐭𝐞𝐪𝐞𝐞𝐦✪",
        group: "𝐓his is for groups only by 𝐌𝐮𝐬𝐭𝐞𝐪𝐞𝐞𝐦✪",
        admin: "𝐓his command is for admin only by 𝐌𝐮𝐬𝐭𝐞𝐪𝐞𝐞𝐦✪",
        private: "𝐓his is specifically for private chat, 𝐁𝐲 𝐌𝐔𝐒𝐓𝐄𝐐𝐄𝐄𝐌"
    },
    mess: {
        owner: 'This command is only for the bot owner! , 𝐁𝐲 𝐌𝐮𝐬𝐭𝐞𝐪𝐞𝐞𝐦✪',
        done: 'Mode changed successfully! ✓𓄄',
        error: 'Something went wrong!✘𓄄',
        wait: 'Please wait...𖣘'
    },
    settings: {
        title: "𝐗𝐀𝐃𝐎𝐍 𝐀𝐈",
        packname: '𝐗𝐀𝐃𝐎𝐍 𝐁𝐎𝐓',
        description: "𝐓𝐡𝐢𝐬 𝐒𝐜𝐫𝐢𝐩𝐭 𝐰𝐚𝐬 𝐜𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲 𝐌𝐮𝐬𝐭𝐞𝐪𝐞𝐞𝐦",
        author: 'https://github.com/CEOcybershieldquad/XADON-AI',
        footer: "饾棈饾柧饾梾饾柧饾梹饾棆饾柡饾梿: @official_musteqeem"
    },
    newsletter: {
        name: "𝐗𝐀𝐃𝐎𝐍 𝐀𝐈",
        id: "0@newsletter"
    },
    api: {
        baseurl: "https://hector-api.vercel.app/",
        apikey: "hector"
    },
    sticker: {
        packname: "𝐗𝐀𝐃𝐎𝐍 𝐁𝐎𝐓",
        author: "𝐌𝐔𝐒𝐓𝐄𝐐𝐄𝐄𝐌"
    }
}

module.exports = config;

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
