const { createCanvas } = require('canvas');

module.exports = {
    command: 'xuptime',
    alias: ['up', 'online', 'runtime'],
    desc: 'Show bot uptime in elite terminal style - v1.0.0',
    category: 'xadon',

    execute: async (sock, m, { reply }) => {
        // Calculate uptime
        const uptimeSeconds = process.uptime();
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);
        const uptimeStr = `\( {hours.toString().padStart(2, '0')}: \){minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const dayName = now.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
        const monthShort = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const dateNum = now.getDate();
        const fullDate = `${dayName}, ${monthShort} ${dateNum}`;

        // Uptime "rank" flavor (fun hacker style)
        let uptimeRank = hours >= 24 ? "ETERNAL UPTIME — LEGEND MODE" :
                         hours >= 12 ? "IMMORTAL SHIFT — UNSTOPPABLE" :
                         hours >= 6  ? "LONG HAUL — SOLID CORE" :
                         hours >= 1  ? "STABLE RUN — LOCKED IN" : "FRESH BOOT — PRIMED";

        // ─── Canvas Setup ───────────────────────────────────────
        const w = 680;
        const h = 460;
        const canvas = createCanvas(w, h);
        const ctx = canvas.getContext('2d');

        // Background: Kali Linux / clean hacker terminal
        ctx.fillStyle = '#0a1f0a';
        ctx.fillRect(0, 0, w, h);

        // Subtle grid
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.06)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Very light CRT scanlines
        ctx.globalAlpha = 0.07;
        ctx.fillStyle = '#003311';
        for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
        ctx.globalAlpha = 1;

        // Light rainbow stars around edges
        const rainbowColors = ['#ff6ec7', '#00f0ff', '#ffd700', '#a78bfa', '#00ff9d'];
        ctx.globalAlpha = 0.9;
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const distToEdge = Math.min(x, y, w - x, h - y);
            if (distToEdge < 100 || Math.random() > 0.7) {
                const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
                ctx.fillStyle = color;
                const size = Math.random() * 2.5 + 0.8;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 8;
                ctx.shadowColor = color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        ctx.globalAlpha = 1;

        // Top neon block
        ctx.shadowBlur = 35;
        ctx.shadowColor = '#00ff9d';
        ctx.fillStyle = 'rgba(0, 255, 65, 0.15)';
        ctx.fillRect(90, 25, w - 180, 80);

        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(90, 25, w - 180, 80);
        ctx.setLineDash([]);

        ctx.shadowBlur = 28;
        ctx.shadowColor = '#00ff9d';
        ctx.fillStyle = '#00ff9d';
        ctx.font = 'bold 40px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('XADON AI v1.0.0', w/2, 70);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#f0fff0';
        ctx.fillText('XADON AI v1.0.0', w/2, 70);

        // Uptime display - silver + gold gradient
        const uptimeDisplay = uptimeStr;

        const silverGrad = ctx.createLinearGradient(w/2 - 100, 200, w/2 + 100, 200);
        silverGrad.addColorStop(0, '#c0c0c0');
        silverGrad.addColorStop(0.5, '#e0e0e0');
        silverGrad.addColorStop(1, '#c0c0c0');

        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ffd700';
        ctx.fillStyle = silverGrad;
        ctx.font = 'bold 160px "Courier New", monospace';
        ctx.fillText(uptimeDisplay, w/2, 240);

        ctx.shadowBlur = 45;
        ctx.shadowColor = '#ffd700';
        ctx.globalAlpha = 0.6;
        ctx.fillText(uptimeDisplay, w/2, 240);
        ctx.globalAlpha = 1;

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(uptimeDisplay, w/2, 240);

        // Created by line
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#c0c0c0';
        ctx.fillStyle = '#c0c0c0';
        ctx.font = 'italic 24px "Courier New", monospace';
        ctx.fillText('Created by Musteqeem ✨', w/2, 320);

        // Bottom timestamp
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff9d';
        ctx.fillStyle = '#00ff9d';
        ctx.font = '20px "Courier New", monospace';
        ctx.fillText(`${timeStr}   ${fullDate}`, w/2, 380);

        // Export
        const buffer = canvas.toBuffer('image/png');

        // Your exact requested caption format
        const caption = `🚀᯾༄𝐗𝐀𝐃𝐎𝐍 𝐀𝐈🚀  ᯾╔══✰═════✰════════✯════════✯══════𖣘╗
║    *ROOT@XADON:\~#*      ║
║    _✯uptime probe complete✰_   ║
║    ✪uptime *${uptimeStr}*     ║
║    ${timeStr} | ${fullDate}║
╚✯═════✰═════════✯════✯══════✰═════𖣘╝
> connection secure - stay in shadows Cybershield squad ⚡`;

        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: caption
        }, { quoted: m });
    }
};