const axios = require('axios');

module.exports = {
    command: 'phoneinfo',
    alias: ['phone', 'number', 'whoiscalling', 'numinfo'],
    description: 'Get phone number information and carrier details',
    category: 'tools',
    usage: '.phoneinfo <number with country code>',

    execute: async (sock, m, { args, reply }) => {

        const phone = args[0]?.replace(/[^0-9+]/g, '');

        if (!phone)
            return reply(`֎ ✪ *XADON AI • PHONE INFO* ✪ ֎

📞 Usage:.phoneinfo <number>

Examples:
-.phoneinfo +2348077528901
-.phoneinfo 12025551234

⚠️ Include country code for accuracy

> ֎`);

        if (phone.replace('+', '').length < 8 || phone.replace('+', '').length > 15)
            return reply('❌ Invalid phone number length. Include country code\n> ֎');

        await sock.sendMessage(m.chat, { react: { text: '📞', key: m.key } });

        try {
            // Free API - no key needed
            const res = await axios.get(`http://apilayer.net/api/validate`, {
                params: {
                    access_key: 'free', // numverify free access
                    number: phone,
                    country_code: '',
                    format: 1
                },
                timeout: 10000
            });

            const data = res.data;

            if (!data.valid) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply(`❌ Invalid phone number\n\n• Number: ${phone}\n• Check country code and format\n\n> ֎`);
            }

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • PHONE INFO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📞 Number: ${data.international_format || data.number || phone}
🌍 Country: ${data.country_name || 'N/A'}
🏛️ Code: +${data.country_code || 'N/A'}
📍 Location: ${data.location || 'Unknown'}
📡 Carrier: ${data.carrier || 'Unknown'}
📱 Line Type: ${data.line_type || 'Unknown'}
✅ Valid: ${data.valid? 'Yes' : 'No'}

⚡ Lookup complete

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '📡', key: m.key } });

        } catch (err) {

            console.error('[PHONEINFO ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to lookup number\n\n';

            if (err.response?.status === 429) {
                msg += '• API rate limit reached. Try again in 1 minute';
            } else if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Check connection';
            } else if (err.response?.status === 404) {
                msg += '• Number not found in database';
            } else {
                msg += '• Check country code and try again';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};