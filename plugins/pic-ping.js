const { createCanvas } = require('canvas');
const os = require('os');

module.exports = {
  command: 'pic-ping',
  alias: [],
  description: 'Show bot ping',
  category: 'general',
  execute: async (sock, m, { reply }) => {
    const ping = Date.now() - m.messageTimestamp * 1000;
    const currentTime = new Date();
    const hoursTime = currentTime.getHours().toString().padStart(2, '0');
    const minutesTime = currentTime.getMinutes().toString().padStart(2, '0');
    const secondsTime = currentTime.getSeconds().toString().padStart(2, '0');
    const day = currentTime.toLocaleString('en-US', { weekday: 'long' });

    const canvas = createCanvas(400, 250);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, '#ff69b4');
    gradient.addColorStop(0.5, '#33cc33');
    gradient.addColorStop(1, '#6666cc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 250);

    // Stars
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 400;
      const y = Math.random() * 250;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Text shadow
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PING', 200, 50);

    // Ping
    ctx.fillStyle = '#ffff00';
    ctx.font = '48px Arial';
    ctx.fillText(`${ping}ms`, 200, 120);

    // Day and Time
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText(`${day}, ${hoursTime}:${minutesTime}:${secondsTime}`, 200, 170);

    // Reset shadow
    ctx.shadowBlur = 0;

    const buffer = canvas.toBuffer('image/png');
    await sock.sendMessage(m.chat, { image: buffer, caption: 'XADON AI Ping' }, { quoted: m });

    const menu = `
🌟 *XADON AI PING MENU* 🌟

📊 *PING*: ${ping}ms
⏰ *RESPONSE TIME*: ${ping}ms
📆 *DAY*: ${day}
🕰️ *TIME*: ${hoursTime}:${minutesTime}:${secondsTime}
🌤️ *WEATHER*: Nah lie ooh🤪 : Patchy rain possible, 29°C, 85% chance of rain, Wind: 26 km/h
> 💫XADON AI ✨
    `;
    await sock.sendMessage(m.chat, { text: menu }, { quoted: m });
  }
};