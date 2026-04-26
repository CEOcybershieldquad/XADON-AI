module.exports = {
  command: 'xtagall',
  alias: ['everyone'],
  description: 'Tag all group members',
  category: 'group',
  groupOnly: true,
  adminOnly: true,
  execute: async (sock, m, { reply }) => {
    try {
      const group = await sock.groupMetadata(m.chat);
      const members = group.participants.map(v => v.id);
      await sock.sendMessage(m.chat, {
        text: `XADON CALL: Attention Everyone XADON AI is live.✨https://chat.whatsapp.com/GrmOceiBVsGGGAPxwoPpFk?mode=gi_t✨`,
        mentions: members
      }, { quoted: m });
    } catch (error) {
      await reply('❌ Failed to tag members');
    }
  }
};