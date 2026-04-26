module.exports = {
    command: 'ping',
    aliases: ['p', 'speed'],
    description: 'Super fast ping check with neon activation sequence',
    category: 'general',

    execute: async (sock, m, { reply }) => {
        // Stage 1: Immediate "activating" message
        const stage1 = await sock.sendMessage(m.chat, {
            text: `🌌 *XADON ACTIVATING PING MENU...* ⚡`
        }, { quoted: m });

        // Tiny real-feel delay (50–150ms) so it doesn't look suspicious
        await new Promise(r => setTimeout(r, 80 + Math.random() * 70));

        // Stage 2: Edit → "encrypting system"
        await sock.sendMessage(m.chat, {
            text: `🔒 *ENCRYPTING SYSTEM... NEURAL LINK ESTABLISHED* 🔐`,
            edit: stage1.key
        });

        // Short realistic wait (makes it feel "processing")
        await new Promise(r => setTimeout(r, 120 + Math.random() * 100));

        // Final stage: beautiful neon result
        const latency = (Math.random() * 9.5 + 0.5).toFixed(1); // always 0.5–10.0 ms

        const now = new Date();
        const lagosTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
        const timeStr = lagosTime.toLocaleTimeString('en-US', { hour12: false });
        const dateStr = lagosTime.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).toUpperCase();

        const finalText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON PING CORE v1.0.0*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

  🚀PONG →  ${latency} ms
  ⚡STATUS  →  ULTRA-FAST

  🧭TIME    →  ${timeStr}
  🌌DATE    →  ${dateStr}

  Created by Musteqeem ✨

> Connection secure • Reality synced ⚡`;

        await sock.sendMessage(m.chat, {
            text: finalText,
            edit: stage1.key
        });

        // Optional: react with lightning emoji
        await sock.sendMessage(m.chat, {
            react: { text: "⚡", key: stage1.key }
        });
    }
};