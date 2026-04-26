const fs = require('fs');

module.exports = {
  command: 'unban',
  alias: [],
  description: 'Unban a member from the group',
  category: 'group',
  execute: async (sock, m, { reply }) => {
    const args = m.text.split(' ');
    if (args.length !== 2) return reply('Usage: unban <jid>');
    let jid = args[1];
    if (!jid.includes('@s.whatsapp.net')) {
      jid += '@s.whatsapp.net';
    }

    // Remove the banned user's JID from the file
    const bannedUsers = fs.existsSync('bannedUsers.json') ? JSON.parse(fs.readFileSync('bannedUsers.json')) : [];
    const index = bannedUsers.indexOf(jid);
    if (index !== -1) {
      bannedUsers.splice(index, 1);
      fs.writeFileSync('bannedUsers.json', JSON.stringify(bannedUsers));
      reply('Member unbanned successfully');
    } else {
      reply('Member is not banned');
    }
  }
};