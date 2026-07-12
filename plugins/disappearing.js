module.exports = {
 command: 'disappearing',
 alias: ['setdisappearing', 'defaulttimer'],
 description: 'Set default disappearing message timer for new chats',
 category: 'privacy',
 usage: '.disappearing <seconds>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

 const seconds = parseInt(args[0]);

 if (isNaN(seconds) || seconds < 0) {
 return reply(`֎ ✪ *XADON AI • DISAPPEARING* ✪ ֎

🌐 Usage:.disappearing <seconds>

Examples:
-.disappearing 0 [OFF]
-.disappearing 86400 [24 hours]
-.disappearing 604800 [7 days]
-.disappearing 2592000 [30 days]

💡 Set default timer for new chats

> ֎`)
 }

 try {
 await sock.updateDefaultDisappearingMode(seconds);
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

 const displayTime = seconds === 0? 'OFF'
 : seconds === 86400? '24 hours'
 : seconds === 604800? '7 days'
 : seconds === 2592000? '30 days'
 : `${seconds} seconds`;

 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • DISAPPEARING UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Default disappearing set to: ${displayTime}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}