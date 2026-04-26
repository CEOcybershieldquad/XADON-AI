const delay = (ms) => new Promise(res => setTimeout(res, ms));

module.exports = {
    command: 'server',
    alias: ['panel', 'host'],
    description: 'Ultra hacker server UI',
    category: 'system',
    usage: '.server',

    execute: async (sock, m, { reply }) => {

        try {

            // ⚡ Start reaction
            await sock.sendMessage(m.chat, {
                react: { text: "💻", key: m.key }
            });

            const name = m.pushName || "Unknown";

            // 🟢 STEP 1
            await reply(`> Booting XADON CORE...`);
            await delay(800);

            // 🟢 STEP 2
            await reply(`> Initializing modules...`);
            await delay(800);

            // 🟢 STEP 3 LOADING BAR
            await reply(`> Loading system [░░░░░░░░░░] 0%`);
            await delay(500);
            await reply(`> Loading system [██░░░░░░░░] 20%`);
            await delay(500);
            await reply(`> Loading system [████░░░░░░] 40%`);
            await delay(500);
            await reply(`> Loading system [██████░░░░] 60%`);
            await delay(500);
            await reply(`> Loading system [████████░░] 80%`);
            await delay(500);
            await reply(`> Loading system [██████████] 100%`);
            await delay(700);

            // 🟢 ACCESS GRANTED
            await reply(`> ACCESS GRANTED ✅`);
            await delay(600);

            // 🟢 NETWORK
            await reply(`> Connecting to secure network...`);
            await delay(800);
            await reply(`> Encryption Enabled (AES-256) 🔐`);
            await delay(600);

            // 🟢 FINAL UI
            const finalUI = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃      ⚡ XADON ULTRA TERMINAL v2.0 ⚡      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👤 USER: ${name}
👑 ROLE: SYSTEM ARCHITECT
🌍 STATUS: ONLINE

╔════════════════════════════════════════════╗
║        🛰️ SERVER CREATION PANEL           ║
╚════════════════════════════════════════════╝

🌐 ACCOUNT NODE
➤ https://client.spaceify.eu

🖥️ CONTROL PANEL
➤ https://panel.spaceify.eu

🧭 TIME : ${new Date().toLocaleTimeString()}
🌌 DATE : ${new Date().toDateString()}

[ SYSTEM LOGS ]
────────────────────────────
✔ Nodes synced
✔ Firewall bypassed
✔ Server access unlocked
✔ Deployment ready ⚡

╭──────────────────────────╮
│ 🔐 SECURITY : MAXIMUM   │
│ ⚡ POWER    : 100%      │
│ 🛰️ NETWORK  : STABLE    │
╰──────────────────────────╯

> TYPE: CREATE SERVER
> STATUS: READY FOR DEPLOYMENT

_`;

            await delay(1000);
            await sock.sendMessage(m.chat, { text: finalUI });

            // ⚡ End reaction
            await sock.sendMessage(m.chat, {
                react: { text: "🚀", key: m.key }
            });

        } catch (err) {

            console.error('[ULTRA SERVER ERROR]', err);

            reply(`❌ SYSTEM CRASH

> ${err.message}

> XADON AI`);
        }
    }
};