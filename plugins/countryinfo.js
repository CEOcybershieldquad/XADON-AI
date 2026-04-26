const axios = require('axios');

module.exports = {
    command: 'countryinfo',
    alias: ['country', 'nation', 'flag'],
    description: 'Get detailed country information',
    category: 'search',
    usage: '.countryinfo <country name>',

    execute: async (sock, m, { args, reply, prefix }) => {
        const country = args.join(' ').trim();

        if (!country) {
            return reply(`֎ ✪ *XADON AI • COUNTRY INFO* ✪ ֎

🌍 Usage:.countryinfo <name>

Examples:
-.countryinfo Nigeria
-.countryinfo Japan
-.countryinfo "United States"
-.country United Kingdom

💡 Detailed country data

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🌍', key: m.key } });

        try {
            const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=false`, {
                timeout: 10000
            });

            const data = res.data?.[0];
            if (!data) throw new Error('Country not found');

            const currencies = Object.values(data.currencies || {}).map(c => `${c.name} (${c.symbol || ''})`).join(', ') || 'N/A';
            const languages = Object.values(data.languages || {}).join(', ') || 'N/A';
            const capital = data.capital?.[0] || 'N/A';
            const population = data.population?.toLocaleString() || 'N/A';
            const area = data.area? `${data.area.toLocaleString()} km²` : 'N/A';
            const flag = data.flag || '';
            const commonName = data.name?.common || 'N/A';
            const officialName = data.name?.official || 'N/A';

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • ${flag} ${commonName.toUpperCase()}*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🏛️ Official: ${officialName}
🏙️ Capital: ${capital}
🌐 Region: ${data.region || 'N/A'}
📍 Subregion: ${data.subregion || 'N/A'}
👥 Population: ${population}
📏 Area: ${area}
💰 Currency: ${currencies}
🗣️ Languages: ${languages}
🚩 Flag: ${flag}

💡 Powered by REST Countries API

> ֎`;

            // Send flag image if available
            if (data.flags?.png) {
                await sock.sendMessage(m.chat, {
                    image: { url: data.flags.png },
                    caption: infoText
                }, { quoted: m });
            } else {
                await sock.sendMessage(m.chat, {
                    text: infoText
                }, { quoted: m });
            }

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[COUNTRY ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Country not found\n\n';

            if (err.response?.status === 404) {
                msg += '• Check spelling\n• Try official name\n• Example: "United Kingdom" not "UK"';
            } else if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Try again';
            } else {
                msg += '• API error or invalid country';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};