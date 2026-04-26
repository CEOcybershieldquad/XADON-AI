const { exec } = require('child_process');

module.exports = {
    command: 'ping-host',
    aliases: [],
    description: 'Ping a host (educational / ethical)',
    category: 'ethical-hacking',
    usage: '.ping <IP or domain>',

    execute: async (sock, m, { args, reply }) => {
        if (!args[0]) return reply('🚀 Usage: .ping <IP or domain>\n> XADON AI');

        const target = args[0];

        exec(`ping -c 4 ${target}`, (error, stdout, stderr) => {
            if (error) return reply(`❌ Ping failed: ${error.message}\n> XADON AI`);
            if (stderr) return reply(`⚠️ Error: ${stderr}\n> XADON AI`);

            sock.sendMessage(m.chat, { text: `✨ ✪ *XADON AI • Ping Test* ✪ ✨\n\n${stdout}\n> XADON AI` });
        });
    }
};