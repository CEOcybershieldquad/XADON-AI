// commands/game/wcg.js
// 2026 NEON WORD CHAIN GAME - Rare Linguistic Battle (Multiplayer) 🌌🔥
// Group-wide • Chain words by last→first letter • Timer • Score tracking

module.exports = {
    command: 'wcg',
    aliases: ['wordchain', 'wordgame'],
    description: 'Start 2026 NEON Word Chain Game (group-wide, endless until del)',
    category: 'fun',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) return reply("🌃 GROUP-ONLY CYBER LINK!");
        if (global.wcgStates?.has(m.chat)) return reply("⏳ CHAIN ALREADY ACTIVE!");

        const state = {
            active: true,
            lastLetter: null,
            lastWord: null,
            chain: [],
            scores: new Map(),
            timer: null
        };
        global.wcgStates.set(m.chat, state);

        let startMsg = `
╭─✦─ NEON WORD CHAIN 2026 ─✦─╮
┃ RARE LINGUISTIC QUANTUM BATTLE
╰─✦─────────────────────────╯

Rules:
• Reply with ONE English word
• Must start with LAST letter of previous word
• 20s timer per link
• +1 point per valid chain
• !delwcg to end

🌀 Starter: *APPLE*
Next letter: *E*

Chain starts now! ⚡`;

        await sock.sendMessage(m.chat, { text: startMsg }, { quoted: m });
        state.lastWord = 'apple';
        state.lastLetter = 'e';
        state.chain.push('apple');

        // First timer
        state.timer = setTimeout(() => nextWordTimeout(sock, m, state), 20000);
    }
};

module.exports.delwcg = {
    command: 'delwcg',
    aliases: ['endwcg'],
    description: 'End Word Chain Game',
    category: 'game',

    execute: async (sock, m, { reply }) => {
        if (!global.wcgStates?.has(m.chat)) return reply("🕳️ No active chain!");
        global.wcgStates.delete(m.chat);
        await reply("🔴 CHAIN SHATTERED\nScores reset!");
    }
};

async function nextWordTimeout(sock, m, state) {
    let timeoutMsg = `
⌛ CHAIN BROKEN!
No link in 20s...

Current Chain:
${state.chain.slice(-5).map(w => `🔗 ${w.toUpperCase()}`).join('\n')}

Top Scorers:
\( {Array.from(state.scores.entries()).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([jid,sc]) => `@ \){jid.split('@')[0]}: ${sc}`).join('\n') || 'None yet'}

Restarting...`;

    await sock.sendMessage(m.chat, { text: timeoutMsg });

    await new Promise(r => setTimeout(r, 3000));
    restartChain(sock, m, state);
}

async function restartChain(sock, m, state) {
    const starters = ['apple', 'banana', 'cyber', 'dragon', 'echo'];
    const starter = starters[Math.floor(Math.random() * starters.length)];
    state.lastWord = starter;
    state.lastLetter = starter.slice(-1).toLowerCase();
    state.chain = [starter];

    let restartMsg = `
🌀 NEW CHAIN: *${starter.toUpperCase()}*
Next: *${state.lastLetter.toUpperCase()}*

Link now! 20s ⏳`;

    await sock.sendMessage(m.chat, { text: restartMsg });
    state.timer = setTimeout(() => nextWordTimeout(sock, m, state), 20000);
}

// ────────────────────────────────────────────────
// REQUIRED: messages.upsert handler snippet

if (global.wcgStates?.has(m.chat) && !body.startsWith('!')) {
    const state = global.wcgStates.get(m.chat);
    if (state.active) {
        const word = body.trim().toLowerCase();
        if (word.length > 2 && word[0] === state.lastLetter && !/\d/.test(word)) {
            clearTimeout(state.timer);
            state.chain.push(word);
            state.lastLetter = word.slice(-1);
            state.scores.set(m.sender, (state.scores.get(m.sender) || 0) + 1);

            let successMsg = `
✅ @\( {m.sender.split('@')[0]} LINKS: * \){word.toUpperCase()}*
Chain: ${state.chain.slice(-3).map(w => w.toUpperCase()).join(' → ')}

Next: *${state.lastLetter.toUpperCase()}* (20s)`;

            await sock.sendMessage(m.chat, { text: successMsg, mentions: [m.sender] }, { quoted: m });
            state.timer = setTimeout(() => nextWordTimeout(sock, m, state), 20000);
        } else {
            await sock.sendMessage(m.chat, { text: "❌ Invalid link!\nMust start with " + state.lastLetter.toUpperCase() }, { quoted: m });
        }
    }
}

// In index.js: global.wcgStates = new Map(); global.tictactoeStates = new Map();