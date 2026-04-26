const axios = require('axios');

module.exports = {
    command: 'sms24',
    alias: ['sms'],
    category: 'vpn',
    description: 'Access SMS24 API: countries, numbers, messages',
    usage: '.sms24 <countries|numbers|messages> [param]',

    execute: async (sock, m, { args, reply }) => {
        try {
            if (!args[0]) {
                return reply(
`📡 *SMS24 Commands*:
• .sms24 countries - List available countries
• .sms24 numbers <country_code> - List numbers for a country
• .sms24 messages <number> - Get messages for a number`
                );
            }

            const subCmd = args[0].toLowerCase();

            // 🌍 Fetch countries
            if (subCmd === 'countries') {
                const { data } = await axios.get('https://apis.prexzyvilla.site/vnum/sms24-countries');
                if (!data || data.length === 0) return reply('❌ No countries found');
                let text = '🌍 *Available Countries:*\n';
                data.forEach(c => text += `• ${c.name} (${c.code})\n`);
                return reply(text);
            }

            // 📞 Fetch numbers by country code
            if (subCmd === 'numbers') {
                const country = args[1];
                if (!country) return reply('⚠️ Please provide a country code');
                const { data } = await axios.get(`https://apis.prexzyvilla.site/vnum/sms24-numbers?country=${country}`);
                if (!data || data.length === 0) return reply('❌ No numbers found');
                let text = `📞 *Numbers for ${country}:*\n`;
                data.forEach(n => text += `• ${n.number} (ID: ${n.id})\n`);
                return reply(text);
            }

            // ✉️ Fetch messages by number
            if (subCmd === 'messages') {
                const number = args[1];
                if (!number) return reply('⚠️ Please provide a number');
                const { data } = await axios.get(`https://apis.prexzyvilla.site/vnum/sms24-messages?number=${number}`);
                if (!data || data.length === 0) return reply('❌ No messages found');
                let text = `✉️ *Messages for ${number}:*\n`;
                data.forEach(msg => text += `• [${msg.date}] ${msg.message}\n`);
                return reply(text);
            }

            return reply('❌ Unknown subcommand. Use countries, numbers, or messages.');
        } catch (err) {
            console.error('SMS24 Error:', err.message);
            return reply('⚠️ Failed to fetch SMS24 data');
        }
    }
};