const warns = new Map();
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  command: 'warn',
  alias: ['warning'],
  description: 'Warn a group member',
  category: 'group',
  execute: async (sock, m, { args, reply }) => {
    try {
      if (!m.isGroup) return reply('This command only works in groups');

      const mentioned = m.mentionedJid[0];
      if (!mentioned) return reply('Mention a member to warn');

      if (!warns.has(m.chat)) warns.set(m.chat, new Map());
      const groupWarns = warns.get(m.chat);

      if (!groupWarns.has(mentioned)) groupWarns.set(mentioned, 0);
      const userWarns = groupWarns.get(mentioned) + 1;

      const warningImage = await generateWarningImage(userWarns);
      const buffer = warningImage.toBuffer('image/png');

      if (userWarns >= 3) {
        await sock.groupParticipantsUpdate(m.chat, [mentioned], 'remove');
        await sock.sendMessage(m.chat, {
          image: buffer,
          caption: `@${mentioned.split('@')[0]} has been removed from the group for reaching 3 warnings`
        });
        groupWarns.delete(mentioned);
      } else {
        groupWarns.set(mentioned, userWarns);
        await sock.sendMessage(m.chat, {
          image: buffer,
          caption: `@${mentioned.split('@')[0]} has been warned (${userWarns}/3)`
        });
      }
    } catch (error) {
      console.error('Warn command error:', error);
      reply(`Error: ${error.message}`);
    }
  }
};

async function generateWarningImage(warns) {
  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext('2d');

  // Rainbow background
  const colors = ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'];
  for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(0, i * (canvas.height / colors.length), canvas.width, canvas.height / colors.length);
  }

  // Shiny stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Warning text
  ctx.font = '36px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`WARNING (${warns}/3)`, canvas.width / 2, canvas.height / 2);

  return canvas;
}