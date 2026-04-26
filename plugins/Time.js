const axios = require('axios');

const TIMEZONES = {
    'lagos': 'Africa/Lagos',
    'london': 'Europe/London',
    'new york': 'America/New_York',
    'los angeles': 'America/Los_Angeles',
    'chicago': 'America/Chicago',
    'toronto': 'America/Toronto',
    'tokyo': 'Asia/Tokyo',
    'dubai': 'Asia/Dubai',
    'paris': 'Europe/Paris',
    'berlin': 'Europe/Berlin',
    'mumbai': 'Asia/Kolkata',
    'delhi': 'Asia/Kolkata',
    'singapore': 'Asia/Singapore',
    'sydney': 'Australia/Sydney',
    'moscow': 'Europe/Moscow',
    'rio': 'America/Sao_Paulo',
    'beijing': 'Asia/Shanghai',
    'cairo': 'Africa/Cairo',
    'nairobi': 'Africa/Nairobi',
    'accra': 'Africa/Accra',
    'abuja': 'Africa/Lagos',
    'capetown': 'Africa/Johannesburg',
    'johannesburg': 'Africa/Johannesburg'
};

function getTimezone(region) {
    const key = region.toLowerCase().trim();
    if (TIMEZONES[key]) return TIMEZONES[key];
    return region;
}

async function getTimeData(timezone) {
    try {
        const res = await axios.get(`https://worldtimeapi.org/api/timezone/${encodeURIComponent(timezone)}`, { timeout: 8000 });
        return { source: 'worldtimeapi', data: res.data };
    } catch (e) {
        try {
            const core = require('../Core/®.js');
            return await core.getTimeData(timezone);
        } catch (e2) {
            throw new Error('All time sources failed');
        }
    }
}

module.exports = {
    command: 'tm',
    alias: ['time', 'timezone', 'clock'],
    description: 'Show current time for any region',
    category: 'general',
    usage: '.tm <region>',

    execute: async (sock, m, { args, reply, prefix }) => {
        const region = args.join(' ').trim();

        if (!region) {
            const popular = Object.keys(TIMEZONES).slice(0, 10).map(r => r.charAt(0).toUpperCase() + r.slice(1));
            return reply(`֎ ✪ *XADON AI • WORLD TIME* ✪ ֎

⏰ Usage:.tm <region>

Popular: ${popular.join(', ')}

💡 Any city worldwide

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '⏰', key: m.key } });

        try {
            const timezone = getTimezone(region);
            const { source, data } = await getTimeData(timezone);

            const datetime = new Date(data.datetime);
            const timeString = datetime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            const dateString = datetime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const regionName = (data.timezone || timezone).split('/').pop().replace(/_/g, ' ');
            const sourceNote = source!== 'worldtimeapi'? ` (via ${source})` : '';

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • ${regionName.toUpperCase()}*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⏰ Current Time: ${timeString}
📅 Date: ${dateString}
🌍 Timezone: ${data.timezone || timezone}
📊 UTC Offset: UTC${data.utc_offset || data.utcOffset || 'N/A'}
🏷️ Abbreviation: ${data.abbreviation || 'N/A'}
☀️ DST: ${data.dst? 'Active 🎭' : 'Inactive 💤'}
📅 Day of Year: Day ${data.day_of_year || 'N/A'} / Week ${data.week_number || 'N/A'}

💡 Set default:.settmd <region>${sourceNote}

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[TM ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Region not found\n\n';

            if (err.message?.includes('404')) {
                msg += '• Invalid timezone. Try: Lagos, London, Tokyo, Dubai';
            } else if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Try again';
            } else {
                msg += '• Check spelling or use major city name';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};