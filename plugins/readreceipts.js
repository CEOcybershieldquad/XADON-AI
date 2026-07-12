module.exports = {
 command: 'readreceipts',
 alias: ['setreadreceipts', 'readprivacy', 'bluetick'],
 description: 'Update read receipts (blue ticks) privacy',
 category: 'privacy',
 usage: '.readreceipts <all/none>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '💙', key: m.key } });

 const setting = args[0]?.toLowerCase();
 const valid = ['all', 'none'];

 if (!setting ||!valid.includes(setting)) {
 return reply(`֎ ✪ *XADON AI • READ RECEIPTS* ✪ ֎

🌐 Usage:.readreceipts <all/none>

Examples:
-.readreceipts all
-.readreceipts none

💡 Control blue tick visibility

> ֎`)
 }

 try {
 await sock.updateReadReceiptsPrivacy(setting);
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • READ RECEIPTS UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Read receipts set to: ${setting}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}