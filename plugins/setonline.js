module.exports = {
 command: 'setonline',
 alias: ['onlineprivacy', 'ponline'],
 description: 'Update who can see when you\'re online',
 category: 'privacy',
 usage: '.setonline <all/match_last_seen>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '🟢', key: m.key } });

 const setting = args[0]?.toLowerCase();
 const valid = ['all', 'match_last_seen'];

 if (!setting ||!valid.includes(setting)) {
 return reply(`֎ ✪ *XADON AI • ONLINE PRIVACY* ✪ ֎

🌐 Usage:.setonline <all/match_last_seen>

Examples:
-.setonline all
-.setonline match_last_seen

💡 Control who can see when you're online

> ֎`)
 }

 try {
 await sock.updateOnlinePrivacy(setting);
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • ONLINE PRIVACY UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Online privacy set to: ${setting}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}