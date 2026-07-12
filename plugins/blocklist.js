module.exports = {
 command: 'blocklist',
 alias: ['blocked', 'blockedlist', 'myblocks'],
 description: 'Get list of blocked users with their names',
 category: 'moderation',
 usage: '.blocklist',

 execute: async (sock, m, { reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '📋', key: m.key } });

 try {
 const blocked = await sock.fetchBlocklist();

 if (!blocked || blocked.length === 0) {
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`֎ ✪ *XADON AI • BLOCKLIST* ✪ ֎

📋 No blocked users found

> ֎`)
 }

 const contacts = sock.store?.contacts || {};
 const lines = blocked.map((jid, i) => {
 const number = jid.split('@')[0];
 const name = contacts[jid]?.name || contacts[jid]?.notify || contacts[jid]?.verifiedName || number;
 return ` ${i + 1}. ${name} [+${number}]`;
 });

 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • BLOCKED USERS* [${blocked.length}]
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

${lines.join('\n')}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}