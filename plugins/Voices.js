const axios = require('axios');

module.exports = {
    command: 'ttsm',
    alias: ['voice'],
    description: 'Text to speech with voice selection',
    category: 'ai',
    usage: '.ttsm 13 Hello world',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length || args.length < 2) {
            return reply(`✨ ✪ *XADON AI • TTS* ✪ ✨

🎙️ *Usage:*
• .ttsm <voice> <text>
• .ttsm 13 Hello world

⚠️ Voices: 1 - 30

> XADON AI`);
        }

        const voiceNum = parseInt(args[0]);

        if (isNaN(voiceNum) || voiceNum < 1 || voiceNum > 30) {
            return reply('⚠️ Voice must be between 1 - 30\n> XADON AI');
        }

        const text = args.slice(1).join(' ').trim();

        if (!text) {
            return reply('⚠️ Provide text to speak\n> XADON AI');
        }

        if (text.length > 200) {
            return reply('⚠️ Max 200 characters\n> XADON AI');
        }

        const voices = {
            1: 'tts-adult-female--1-american-english-truvoice',
            2: 'tts-adult-female--2-american-english-truvoice',
            3: 'tts-adult-male--1-american-english-truvoice',
            4: 'tts-adult-male--2-american-english-truvoice',
            5: 'tts-adult-male--3-american-english-truvoice',
            6: 'tts-adult-male--4-american-english-truvoice',
            7: 'tts-adult-male--5-american-english-truvoice',
            8: 'tts-adult-male--6-american-english-truvoice',
            9: 'tts-adult-male--7-american-english-truvoice',
            10: 'tts-adult-male--8-american-english-truvoice',
            11: 'tts-female-whisper',
            12: 'tts-male-whisper',
            13: 'tts-mary',
            14: 'tts-mary--for-telephone-',
            15: 'tts-mary-in-hall',
            16: 'tts-mary-in-space',
            17: 'tts-mary-in-stadium',
            18: 'tts-mike',
            19: 'tts-mike--for-telephone-',
            20: 'tts-mike-in-hall',
            21: 'tts-mike-in-space',
            22: 'tts-mike-in-stadium',
            23: 'tts-robo-soft-five',
            24: 'tts-robo-soft-four',
            25: 'tts-robo-soft-one',
            26: 'tts-robo-soft-six',
            27: 'tts-robo-soft-three',
            28: 'tts-robo-soft-two',
            29: 'tts-sam',
            30: 'tts-bonzi'
        };

        const endpoint = voices[voiceNum];
        const apiUrl = `https://apis.prexzyvilla.site/tts/${endpoint}?text=${encodeURIComponent(text)}`;

        try {

            await sock.sendMessage(m.chat, {
                react: { text: "🎙️", key: m.key }
            });

            // Fetch API JSON
            const { data } = await axios.get(apiUrl, { timeout: 10000 });

            const audioUrl = data?.audio_url?.result || data?.audio_url?.url || data?.audio_url;

            if (!audioUrl) {
                return reply('❌ Failed to get audio\n> XADON AI');
            }

            // Fetch audio buffer
            const audioRes = await axios.get(audioUrl, {
                responseType: 'arraybuffer',
                timeout: 15000
            });

            const buffer = Buffer.from(audioRes.data);

            if (buffer.length < 1000) {
                return reply('❌ Audio too small or expired\n> XADON AI');
            }

            // ✅ SEND AS VOICE NOTE (BEST FORMAT)
            await sock.sendMessage(m.chat, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: true
            }, { quoted: m });

        } catch (err) {

            console.error('[TTS ERROR]', err?.message || err);

            reply(`❌ TTS failed

• API may be down
• Audio expired

> XADON AI`);
        }
    }
};