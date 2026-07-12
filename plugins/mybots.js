module.exports = {
 command: 'mybots',
 alias: ['metabots', 'aibots', 'botlist'],
 description: 'List available Meta AI bots on WhatsApp',
 category: 'utility',
 usage: '.mybots',

 execute: async (sock, m, { reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '🤖', key: m.key } });

 try {
 const list = await sock.getBotListV2();

 if (!list || list.length === 0) {
 return reply(`֎ ✪ *XADON AI • META BOTS* ✪ ֎

❌ No Meta AI bots found

> ֎`)
 }

 const lines = list.map((b, i) =>
 ` ${i + 1}. ${b.jid}\n ❏◦ Persona: ${b.personaId || 'N/A'}`
 ).join('\n\n');

 await sock.sendMessage(m.chat, {
 text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • META AI BOTS* [${list.length}]
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

${lines}

> ֎`
 }, { quoted: m });

 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ ${err.message}

> ֎`)
 }
 }
}