const fs = require('fs');
const path = require('path');
const axios = require('axios');

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

async function downloadFile(url, outputPath) {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 60000 });
    fs.writeFileSync(outputPath, res.data);
    return outputPath;
}

module.exports = {
    command: 'xlyrics',
    alias: ['lyrics', 'lyric', 'song'],
    description: 'Search lyrics, generate AI music from lyrics, or create lyrics from prompt',
    category: 'tools',
    usage: '.xlyrics <search|genmusic|genlyrics> <query>',

    execute: async (sock, m, { args, reply }) => {
        const sub = args[0]?.toLowerCase();
        const query = args.slice(1).join(' ');

        if (!sub) {
            return reply(`֎ ✪ *XADON AI • LYRICS TOOL* ✪ ֎

🎵 Usage:

1..xlyrics search <song name>
   Search for lyrics

2..xlyrics genmusic <lyrics> | <title> | <style> | <model>
   Generate AI music from lyrics
   Example:.xlyrics genmusic I love coding | XADON Anthem | Pop | v1

3..xlyrics genlyrics <prompt>
   Generate lyrics from prompt
   Example:.xlyrics genlyrics A sad song about rainy days

💡 Separate genmusic params with |

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🎵', key: m.key } });

        try {
            // 🔍 SEARCH LYRICS
            if (sub === 'search') {
                if (!query) {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply(`❌ Provide song name\n\nExample:.xlyrics search Blinding Lights\n\n> ֎`);
                }

                const res = await axios.get(`https://apis.prexzyvilla.site/search/lyrics`, {
                    params: { title: query },
                    timeout: 15000
                });

                const data = res.data;

                if (!data ||!data.lyrics) {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply(`❌ Lyrics not found for: ${query}\n\n> ֎`);
                }

                const title = data.title || query;
                const artist = data.artist || 'Unknown';
                const lyrics = data.lyrics.slice(0, 3500);

                await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
                return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • LYRICS: ${title.toUpperCase()}*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

👤 Artist: ${artist}

${lyrics}${data.lyrics.length > 3500? '\n\n...truncated' : ''}

> ֎`);
            }

            // 🎼 GENERATE AI MUSIC FROM LYRICS
            if (sub === 'genmusic' || sub === 'music') {
                const parts = query.split('|').map(s => s.trim());
                const [lyrics, title, styles, model] = parts;

                if (!lyrics) {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply(`❌ Provide lyrics\n\nExample:.xlyrics genmusic I am the storm | XADON Theme | Epic Rock | v1\n\nFormat: lyrics | title | style | model\n\n> ֎`);
                }

                await sock.sendMessage(m.chat, { text: `֎ Generating AI music...\n\n🎵 This may take 30-60s\n\n> ֎` }, { quoted: m });

                const res = await axios.get(`https://apis.prexzyvilla.site/ai/musicfromlyrics`, {
                    params: {
                        lyrics: lyrics,
                        title: title || 'XADON AI Track',
                        styles: styles || 'Pop',
                        instrumental: false,
                        model: model || 'v1'
                    },
                    timeout: 120000
                });

                const data = res.data;

                if (!data ||!data.audio_url) {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply(`❌ Music generation failed\n\n• API may be busy\n• Try shorter lyrics\n\n> ֎`);
                }

                const audioPath = path.join(tempDir, `genmusic_${Date.now()}.mp3`);
                await downloadFile(data.audio_url, audioPath);

                await sock.sendMessage(m.chat, {
                    audio: fs.readFileSync(audioPath),
                    mimetype: 'audio/mpeg',
                    fileName: `${title || 'XADON_AI_Track'}.mp3`,
                    caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • AI GENERATED MUSIC*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🎵 Title: ${title || 'XADON AI Track'}
🎨 Style: ${styles || 'Pop'}
🤖 Model: ${model || 'v1'}

> ֎`
                }, { quoted: m });

                fs.unlinkSync(audioPath);
                await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
                return;
            }

            // ✍️ GENERATE LYRICS FROM PROMPT
            if (sub === 'genlyrics' || sub === 'create') {
                if (!query) {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply(`❌ Provide a prompt\n\nExample:.xlyrics genlyrics A hype song about coding at 3AM\n\n> ֎`);
                }

                const res = await axios.get(`https://apis.prexzyvilla.site/ai/genlyrics`, {
                    params: { prompt: query },
                    timeout: 20000
                });

                const data = res.data;

                if (!data ||!data.lyrics) {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply(`❌ Lyrics generation failed\n\n• Try a different prompt\n\n> ֎`);
                }

                await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
                return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • AI GENERATED LYRICS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

💡 Prompt: ${query}

${data.lyrics}

> ֎`);
            }

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ Invalid subcommand\n\nUse: search | genmusic | genlyrics\nRun.xlyrics for help\n\n> ֎`);

        } catch (err) {
            console.error('[XLYRICS ERROR]', err?.message || err);
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Lyrics operation failed\n\n';
            if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out\n• API may be slow';
            } else if (err.response?.status === 404) {
                msg += '• Not found on API';
            } else if (err.response?.status === 429) {
                msg += '• API rate limit hit\n• Try again later';
            } else {
                msg += `• ${err.message}`;
            }

            return reply(msg + '\n\n> ֎');
        }
    }
};