const axios = require('axios');

module.exports = {
    command: 'httpcheck',
    aliases: ['headers'],
    description: 'Check HTTP headers of a website (ethical use only)',
    category: 'xadon',
    usage: '.httpcheck <URL>',

    execute: async (sock, m, { args, reply }) => {
        if (!args[0]) return reply('🚀 Usage: .httpcheck <URL>\n> XADON AI');

        const url = args[0].startsWith('http') ? args[0] : 'http://' + args[0];

        try {
            const res = await axios.get(url);
            const headers = JSON.stringify(res.headers, null, 2);
            const limitedHeaders = headers.length > 1000 ? headers.slice(0,1000) + '...\n> XADON AI' : headers + '\n> XADON AI';
            
            sock.sendMessage(m.chat, { text: `✨ ✪ *XADON AI • HTTP Header Check* ✪ ✨\n\n${limitedHeaders}` });
        } catch (err) {
            console.error(err);
            reply(`❌ Failed to fetch headers: ${err.message}\n> XADON AI`);
        }
    }
};