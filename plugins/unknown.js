const { createCanvas } = require('canvas');

module.exports = {
    command: 'xping',
    alias: ['speed', 'latency', 'test', 'hackping'],
    description: 'Clean Kali-style terminal ping - v1.0.0',
    category: 'xadon',

    execute: async (sock, m, { reply }) => {
        const ping = Date.now() - m.messageTimestamp * 1000;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const dayName = now.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
        const monthShort = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const dateNum = now.getDate();
        const fullDate = `${dayName}, ${monthShort} ${dateNum}`;

        // ─── Canvas Setup ───────────────────────────────────────
        const w = 680;
        const h = 460;
        const canvas = createCanvas(w, h);
        const ctx = canvas.getContext('2d');

        // 1. Kali Linux / Hacker Terminal Background
        ctx.fillStyle = '#0a1f0a'; // dark green-black
        ctx.fillRect(0, 0, w, h);

        // Very subtle grid (Kali style)
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.06)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Light CRT scanlines
        ctx.globalAlpha = 0.07;
        ctx.fillStyle = '#003311';
        for (let y = 0; y < h; y += 3) {
            ctx.fillRect(0, y, w, 1);
        }
        ctx.globalAlpha = 1;

        // 2. Light rainbow stars around edges & corners
        const rainbowColors = ['#ff6ec7', '#00f0ff', '#ffd700', '#a78bfa', '#00ff9d'];
        ctx.globalAlpha = 0.9;
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const distToEdge = Math.min(x, y, w - x, h - y);
            if (distToEdge < 100 || Math.random() > 0.7) { // mostly near edges
                const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
                ctx.fillStyle = color;
                const size = Math.random() * 2.5 + 0.8;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();

                // tiny glow
                ctx.shadowBlur = 8;
                ctx.shadowColor = color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        ctx.globalAlpha = 1;

        // 3. Main title block - clean & elegant
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#00ff9d';
        ctx.fillStyle = '#00ff9d';
        ctx.font = 'bold 42px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('XADON AI v1.0.0', w/2, 80);

        // white core
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#f0fff0';
        ctx.fillText('XADON AI v1.0.0', w/2, 80);

        // 4. Ping number - silver + gold gradient + glow
        const pingStr = Math.round(ping).toString();

        // Silver base
        const silverGrad = ctx.createLinearGradient(w/2 - 100, 200, w/2 + 100, 200);
        silverGrad.addColorStop(0, '#c0c0c0');
        silverGrad.addColorStop(0.5, '#e0e0e0');
        silverGrad.addColorStop(1, '#c0c0c0');

        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ffd700';
        ctx.fillStyle = silverGrad;
        ctx.font = 'bold 180px "Courier New", monospace';
        ctx.fillText(pingStr, w/2, 240);

        // Gold accent glow
        ctx.shadowBlur = 45;
        ctx.shadowColor = '#ffd700';
        ctx.globalAlpha = 0.6;
        ctx.fillText(pingStr, w/2, 240);
        ctx.globalAlpha = 1;

        // Sharp white core
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(pingStr, w/2, 240);

        // ms unit
        ctx.font = 'bold 70px "Courier New", monospace';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('MS', w/2 + 130, 240);

        // 5. Created by line - silver & elegant
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#c0c0c0';
        ctx.fillStyle = '#c0c0c0';
        ctx.font = 'italic 24px "Courier New", monospace';
        ctx.fillText('Created by Musteqeem ✨', w/2, 320);

        // 6. Bottom timestamp & day
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff9d';
        ctx.fillStyle = '#00ff9d';
        ctx.font = '20px "Courier New", monospace';
        ctx.fillText(`${timeStr}   ${fullDate}`, w/2, 380);

        // ─── Export & Send ───────────────────────────────────────
        const buffer = canvas.toBuffer('image/png');

        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: `🚀᯾༄𝐗𝐀𝐃𝐎𝐍 𝐀𝐈🚀  ᯾╔══✰═════✰════════✯════════✯══════𖣘╗
║    *ROOT@XADON:\~#*      ║
║    _✯ping probe complete✰_   ║
║    ✪latency *${Math.round(ping)}ms*     ║
║    ${timeStr} | ${fullDate}║
╚✯═════✰═════════✯════✯══════✰═════𖣘╝
> connection secure - stay in shadows Cybershield squad ⚡`
        }, { quoted: m });
    }
};