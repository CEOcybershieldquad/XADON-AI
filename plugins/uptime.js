const { createCanvas } = require('canvas');
const os = require('os');

module.exports = {
  command: 'uptime',
  alias: [],
  description: 'Show bot uptime',
  category: 'general',
  execute: async (sock, m, { reply }) => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);

    const currentTime = new Date();
    const hoursTime = currentTime.getHours().toString().padStart(2, '0');
    const minutesTime = currentTime.getMinutes().toString().padStart(2, '0');
    const secondsTime = currentTime.getSeconds().toString().padStart(2, '0');

    const canvas = createCanvas(400, 250);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, '#ff69b4');
    gradient.addColorStop(0.5, '#33cc33');
    gradient.addColorStop(1, '#6666cc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 250);

    // Text shadow
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('XADON AI Uptime', 200, 20);

    // Uptime
    ctx.fillStyle = '#ffff00';
    ctx.font = '24px Arial';
    ctx.fillText(`Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`, 200, 50);

    // Current Time
    ctx.fillStyle = '#ff66cc';
    ctx.font = '24px Arial';
    ctx.fillText(`Time: ${hoursTime}:${minutesTime}:${secondsTime}`, 200, 80);

    // CPU and RAM
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.fillText(`CPU: ${os.cpus()[0].model}`, 200, 120);
    ctx.fillText(`RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`, 200, 150);

    // Reset shadow
    ctx.shadowBlur = 0;

    const buffer = canvas.toBuffer('image/png');
    await sock.sendMessage(m.chat, { image: buffer, caption: 'XADON AI Uptime' }, { quoted: m });

    const ping = Date.now() - m.messageTimestamp * 1000;
    const menu = `
🌟 *XADON AI MENU* 🌟

📊 *PING*: ${ping}ms
📍 *LOCATION*: Nigeria
📈 *LATENCY*: ${ping}ms
💻 *CPU*: ${os.cpus()[0].model}
💾 *RAM*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB
👨‍💻 *CREATOR*: Musteqeem MD

I am XADON AI created by Musteqeem MD
    `;
    await sock.sendMessage(m.chat, { text: menu }, { quoted: m });
  }
};
