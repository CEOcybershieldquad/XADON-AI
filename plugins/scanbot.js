module.exports = {
    command: 'scanbots',
    aliases: ['botscan', 'findbots', 'botcheck', 'bots'],
    description: 'Scans group members and shows likely bot / automation accounts',
    category: 'group',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) {
            return reply("This command works only in groups.");
        }

        // Check if bot is admin (needed to see full participant list reliably)
        const groupMeta = await sock.groupMetadata(m.chat);
        const botIsAdmin = groupMeta.participants.some(p => p.id === sock.user.id && (p.admin === 'admin' || p.admin === 'superadmin'));

        if (!botIsAdmin) {
            return reply("⚠️ Bot must be **admin** in the group to scan properly.");
        }

        await reply("🔍 Scanning group members... (this may take a few seconds)");

        const participants = groupMeta.participants || [];
        const total = participants.length;

        // Criteria that often indicate a bot / automation account
        const likelyBots = [];
        const suspicious = [];

        for (const p of participants) {
            const jid = p.id;
            const number = jid.split('@')[0];

            const flags = [];

            // 1. Very new-looking number (common in bot farms)
            if (/^234[78][01]/.test(number) || /^234[89]0/.test(number)) {
                flags.push("new-prefix");
            }

            // 2. Business account indicator (many bots use WA Business)
            if (p.isBusiness) {
                flags.push("business");
            }

            // 3. No profile picture or very default-looking
            // (can't check directly in Baileys without extra call, so we skip or mark high suspicion)

            // 4. Very short name / no name changes / common bot names
            // (requires store or extra metadata – optional)

            // 5. Very high activity or zero real interaction (hard without history)

            // Simple heuristic combination
            if (flags.length >= 1 || number.startsWith('23480') || number.startsWith('23481')) {
                likelyBots.push({ jid, flags });
            }

            // Suspicious but not certain
            if (number.length < 11 || number.startsWith('23470') || number.startsWith('23490')) {
                suspicious.push({ jid, flags });
            }
        }

        // ── Build result message ──────────────────────────────────────────────
        let txt = `✦ ───── ⋆⋅ XADON BOT SCAN ⋅⋆ ───── ✦\n\n`;
        txt += `Group: ${groupMeta.subject}\n`;
        txt += `Total members: ${total}\n\n`;

        if (likelyBots.length > 0) {
            txt += `🔴 *Likely bots / automation accounts* (${likelyBots.length})\n`;
            likelyBots.forEach((b, i) => {
                txt += `\( {i+1}. @ \){b.jid.split('@')[0]} `;
                if (b.flags.length) txt += `(${b.flags.join(", ")})`;
                txt += "\n";
            });
            txt += "\n";
        } else {
            txt += "🟢 No strong bot indicators found in this group.\n\n";
        }

        if (suspicious.length > 0) {
            txt += `🟡 *Suspicious / possible bots* (${suspicious.length})\n`;
            suspicious.slice(0, 15).forEach((s, i) => {
                txt += `\( {i+1}. @ \){s.jid.split('@')[0]}\n`;
            });
            if (suspicious.length > 15) {
                txt += `... and ${suspicious.length - 15} more\n`;
            }
            txt += "\n";
        }

        txt += `Scan performed by XADON AI • ${new Date().toLocaleString('en-NG')}\n`;
        txt += `Accuracy: heuristic-based (not 100%)`;

        await sock.sendMessage(m.chat, {
            text: txt,
            mentions: [...likelyBots.map(b => b.jid), ...suspicious.map(s => s.jid)]
        }, { quoted: m });

        await sock.sendMessage(m.chat, {
            react: { text: "🔍", key: m.key }
        });
    }
};