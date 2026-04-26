module.exports = {
  command: 'groupstatus',
  alias: ['gs'],
  category: 'group',
  owner: true,

  execute: async (sock, m, { reply }) => {
    try {
      if (!m.isGroup) return reply('❌ Use inside a group.');

      const quoted = m.quoted;
      if (!quoted) return reply('⚠ Reply to media.');

      const metadata = await sock.groupMetadata(m.chat);
      const participants = metadata.participants.map(p => p.id);

      const buffer = await quoted.download();

      let message = {};

      if (quoted.mtype === 'imageMessage') {
        message = {
          image: buffer,
          caption: `╔═══〔 ⚡ GROUP STATUS DROP by XADON ⚡ 〕═══╗
📡 Distributed to all members
🔥 Premium Energy Activated
╚═══════════════════════════╝`
        };
      } 
      else if (quoted.mtype === 'videoMessage') {
        message = {
          video: buffer,
          caption: `╔═══〔 ⚡ XADON GROUP STATUS DROP ⚡ 〕═══╗
📡 Distributed to all members
🔥 Premium Energy Activated
╚═══════════════════════════╝`
        };
      } 
      else if (quoted.mtype === 'audioMessage') {
        message = { audio: buffer, ptt: true };
      } 
      else {
        return reply('❌ Unsupported media.');
      }

      // Send invisible mention blast
      const sentMsg = await sock.sendMessage(
        m.chat,
        {
          ...message,
          mentions: participants
        }
      );

      // React
      await sock.sendMessage(m.chat, {
        react: { text: '🚀', key: m.key }
      });

      // Delete command message (stealth)
      await sock.sendMessage(m.chat, {
        delete: m.key
      });

      // Optional auto delete after 2 minutes
      setTimeout(async () => {
        await sock.sendMessage(m.chat, {
          delete: sentMsg.key
        }).catch(() => {});
      }, 120000);

    } catch (err) {
      console.log('Illusion Status Error:', err);
      reply('❌ Failed to activate group status.');
    }
  }
};
