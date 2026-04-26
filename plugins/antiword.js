module.exports = {
  command: 'antiword',
  alias: [],
  description: 'Enable/Disable antiword in the group',
  category: 'antis',
  execute: async (sock, m, { reply }) => {
    const groupMetadata = await sock.groupMetadata(m.chat);
    const antiword = groupMetadata.antiword;
    if (antiword) {
      await sock.groupUpdate(m.chat, { antiword: false });
      reply('Antiword disabled');
    } else {
      await sock.groupUpdate(m.chat, { antiword: true });
      reply('Antiword enabled');
    }
  }
};