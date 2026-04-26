const axios = require('axios');

module.exports = {
    command: 'quran',
    alias: ['koran', 'surah', 'ayah', 'ayat', 'alkareem'],
    description: 'Get Quran verses with Arabic + English translation',
    category: 'tools',
    usage: '.quran <surah:verse> |.quran list',

    execute: async (sock, m, { args, reply, prefix }) => {
        const text = args.join(' ').trim().toLowerCase();

        if (!text) {
            return reply(`֎ ✪ *XADON AI • AL-QURAN* ✪ ֎

☪️ Usage:.quran <surah:verse>

Examples:
-.quran 1:1
-.quran 36:1
-.quran 112:1
-.quran 2:255
-.quran list

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '☪️', key: m.key } });

        try {
            // ── LIST ALL SURAHS ─────────────────────────────────────
            if (text === 'list') {
                const res = await axios.get('https://api.alquran.cloud/v1/surah', {
                    timeout: 10000,
                    headers: { 'Accept': 'application/json' }
                });

                const surahs = res.data?.data;
                if (!surahs) throw new Error('No data');

                let listText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • SURAH LIST*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

`;

                for (const s of surahs.slice(0, 30)) {
                    listText += `${s.number}. ${s.englishName} (${s.name})\n ${s.englishNameTranslation} • ${s.numberOfAyahs} ayahs\n\n`;
                }

                listText += `📖 114 Surahs Total\n`;
                listText += `💡 Use ${prefix}quran <number:verse>\n\n> ֎`;

                await sock.sendMessage(m.chat, {
                    text: listText
                }, { quoted: m });

                await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
                return;
            }

            // ── PARSE SURAH:VERSE ────────────────────────────────────
            const parts = text.split(':');
            if (parts.length < 2) {
                return reply('❌ Format: surah:verse e.g., 1:1, 36:1, 112:1\n> ֎');
            }

            const surah = parseInt(parts[0]);
            const verse = parseInt(parts[1]);

            if (!surah ||!verse || surah < 1 || surah > 114) {
                return reply('❌ Invalid surah. Use 1-114\n> ֎');
            }

            // Get Arabic + English + surah info
            const [arabicRes, englishRes, surahRes] = await Promise.all([
                axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${verse}/ar.asad`, { timeout: 10000 }),
                axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${verse}/en.sahih`, { timeout: 10000 }),
                axios.get(`https://api.alquran.cloud/v1/surah/${surah}`, { timeout: 10000 })
            ]);

            const arabic = arabicRes.data?.data?.text || '';
            const english = englishRes.data?.data?.text || '';
            const surahInfo = surahRes.data?.data;

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • AL-QURAN AL-KAREEM*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📖 Surah: ${surahInfo?.englishName || `Surah ${surah}`} (${surah}:${verse})
🕋 Arabic: ${surahInfo?.name || ''}
🌍 Meaning: ${surahInfo?.englishNameTranslation || ''}
🏠 Revelation: ${surahInfo?.revelationType === 'Meccan'? '🕋 Meccan' : '🕌 Medinan'}
📜 Total Ayahs: ${surahInfo?.numberOfAyahs || ''}

☪️ Arabic:
${arabic}

📝 English:
${english}

💡 ${prefix}quran list for all surahs

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[QURAN ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to fetch verse\n\n';

            if (err.response?.status === 404) {
                msg += '• Verse not found. Check surah:verse format';
            } else if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Try again';
            } else {
                msg += '• API error. Try again later';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};