module.exports = {
  command: 'broadcast',
  alias: ['bc'],
  description: 'Broadcast a message to all groups',
  category: 'owner',
  execute: async (sock, m, { args, reply }) => {
    try {
      if (args.length === 0) return reply('Enter a message to broadcast');
      const message = args.join(' ');
      const groups = await sock.groupFetchAllParticipating();
      const broadcastResults = [];
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const senderName = m.pushName || 'Unknown';
      const senderNumber = m.sender.split('@')[0];
      const currentTime = new Date().toLocaleTimeString();
      for (const id in groups) {
        try {
          await delay(2000); // 2-second delay
          const groupMetadata = await sock.groupMetadata(id);
          const participants = groupMetadata.participants.map(p => p.id);
          const broadcastMessage = `
┌─── *🌟🚀 XADON BROADCAST System 📞💫* ───┐
│
│ *🚀 Owner ✨* : *${senderName}* (${senderNumber})
│ *🚀 Time 🧭* : ${currentTime}
│
├───────────────────────────
│
│ *🚀 Message 💫*
│ ${message}
│
└───────────────────────────
`;
          await sock.sendMessage(id, {
            text: broadcastMessage,
            mentions: participants
          });
          broadcastResults.push(`✅ Message sent to ${groupMetadata.subject}`);
        } catch (error) {
          broadcastResults.push(`❌ Error sending to ${id}: ${error.message}`);
        }
      }
      reply(`Broadcast results:\n${broadcastResults.join('\n')}`);
    } catch (error) {
      console.error('Broadcast command error:', error);
      reply(`Error: ${error.message}`);
    }
  }
};