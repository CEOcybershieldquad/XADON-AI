const { exec } = require('child_process');

module.exports = {
    command: 'nmap',
    aliases: [],
    description: 'Scan ports of your server or local IP (ethical use only!)',
    category: 'xadon',
    usage: '.nmap <IP or domain>',

    execute: async (sock, m, { args, reply }) => {
        if (!args[0]) return reply('🚀 Usage: .nmap <IP or domain>\n> XADON AI');

        const target = args[0];

        // Only legal use warning
        await reply(`⚡ Performing ethical scan on ${target}...\n> XADON AI`);

        exec(`nmap -Pn ${target}`, (error, stdout, stderr) => {
            if (error) return reply(`❌ Scan failed: ${error.message}\n> XADON AI`);
            if (stderr) return reply(`⚠️ Error: ${stderr}\n> XADON AI`);

            // Limit output to first 1000 chars
            const output = stdout.length > 1000 ? stdout.slice(0,1000) + '...\n> XADON AI' : stdout + '\n> XADON AI';

            sock.sendMessage(m.chat, { text: `✨ ✪ *XADON AI • Ethical Scan* ✪ ✨\n\n${output}` });
        });
    }
};