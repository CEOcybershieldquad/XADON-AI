const { createCanvas } = require('canvas');
const fs = require('fs');

module.exports = {
  command: 'ban',
  alias: [],
  description: 'Ban a member from the group',
  category: 'group',
  execute: async (sock, m, { reply }) => {
    const jid = m.quoted ? m.quoted.sender : m.mentionedJid[0];
    if (!jid) return reply('Mention a member to ban');

    // Store the banned user's JID in a file
    const bannedUsers = fs.existsSync('bannedUsers.json') ? JSON.parse(fs.readFileSync('bannedUsers.json')) : [];
    bannedUsers.push(jid);
    fs.writeFileSync('bannedUsers.json', JSON.stringify(bannedUsers));

    await sock.groupParticipantsUpdate(m.chat, [jid], 'remove');
    reply('Member banned successfully');

    // Create a canvas to display the banned message
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 400, 200);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BANNED USER ALERT', 200, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`A banned user has been added by Admin ${m.sender.split('@')[0]}`, 200, 120);

    const buffer = canvas.toBuffer('image/png');

    // Set up an event listener to detect when the banned member is added back to the group
    sock.ev.on('group.participants.update', async (update) => {
      if (update.jid === m.chat && update.action === 'add') {
        const bannedUsers = JSON.parse(fs.readFileSync('bannedUsers.json'));
        if (bannedUsers.includes(update.participants[0])) {
          await sock.sendMessage(m.chat, { image: buffer, caption: 'Banned user alert!' });
          await sock.groupParticipantsUpdate(m.chat, [update.participants[0]], 'remove');
        }
      }
    });
  }
};