const axios = require('axios');

module.exports = {
    command: 'joke',
    aliases: ['funny'],
    category: 'fun',
    description: 'Get random joke',

    execute: async (sock, m) => {

        let joke = "Why do coders hate bugs? Because they love debugging 😂";

        try {
            const res = await axios.get('https://v2.jokeapi.dev/joke/Any');
            
            if (res.data.type === 'single') {
                joke = res.data.joke;
            } else {
                joke = `${res.data.setup}\n\n😂 ${res.data.delivery}`;
            }

        } catch (e) {}

        const msg = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • PRO JOKE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

😂 ${joke}

⚡ Enjoy your moment

> XADON AI`;

        await sock.sendMessage(m.chat, { text: msg }, { quoted: m });
    }
};