const { exec } = require('child_process');

module.exports = {
    command: 'traceroute',
    aliases: ['tracert'],
    description: 'Perform traceroute to a host (ethical use only)',
    category: 'xadon',
    usage: '.traceroute <IP or domain>',

    execute: async (sock, m, { args, reply }) => {
        if (!args[0]) return reply('🚀 Usage: .traceroute <IP or domain>\n> XADON AI');

        const target = args[0];

        exec(`traceroute ${target}`, (error, stdout, stderr) => {
            if (error) return reply(`❌ Traceroute failed: ${error.message}\n> XADON AI`);
            if (stderr) return reply(`⚠️ Error: ${stderr}\n> XADON AI`);

            const output = stdout.length > 1000 ? stdout.slice(0,1000) + '...\n> XADON AI' : stdout + '\n> XADON AI';

            sock.sendMessage(m.chat, { text: `✨ ✪ *XADON AI • Traceroute* ✪ ✨\n\n${output}` });
        });
    }
};