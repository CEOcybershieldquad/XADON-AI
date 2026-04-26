const os = require('os');

module.exports = {
    command: 'menu2',
    aliases: ['help', 'panel'],
    description: 'Show bot command menu',
    category: 'general',

    execute: async (sock, m, { reply }) => {

        const usedMem = process.memoryUsage().heapUsed / 1024 / 1024;
        const totalMem = os.totalmem() / 1024 / 1024 / 1024;
        const memPercent = (usedMem / (totalMem * 1024)) * 100;

        const ramBar = '▰'.repeat(Math.floor(memPercent / 20)) + '▱'.repeat(5 - Math.floor(memPercent / 20));

        const uptimeSec = process.uptime();
        const days = Math.floor(uptimeSec / (3600 * 24));
        const hours = Math.floor((uptimeSec % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);

        const uptime = `${days}d ${hours}h ${minutes}m`;

        const ping = Date.now() - m.messageTimestamp * 1000;
        const host = os.platform();
        const mode = sock.public ? 'Public' : 'Self';

        const pluginMenuSections = global.pluginLoader?.getMenuSections?.() || 'No commands loaded';
        const totalCommands = global.pluginLoader?.getPluginCount?.() || 0;

        const menu = `╭━━━〔 ✦ XADON AI ✦ 〕━━━╮
┃ 🤖 *SYSTEM STATUS*
┃
┃ 👑 Owner : Musteqeem
┃ ⚡ Prefix : [ . ]
┃ 🖥️ Host   : ${host}
┃ ⚙️ Mode   : ${mode}
┃ 📚 Cmds   : ${totalCommands}
┃ 🚀 Speed  : ${ping.toFixed(0)} ms
┃ ⏱️ Uptime : ${uptime}
┃ 💾 RAM    : ${usedMem.toFixed(2)}MB / ${totalMem.toFixed(2)}GB
┃ 📊 Usage  : [${ramBar}] ${memPercent.toFixed(1)}%
╰━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📜 COMMAND LIST 〕━━━╮
${pluginMenuSections}
╰━━━━━━━━━━━━━━━━━━╯

> ✪ Powered by XADON AI ⚡`;

        await sock.sendMessage(m.chat, {
            image: image, // make sure you have this defined globally
            caption: menu,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "XADON AI",
                    body: "Advanced WhatsApp Bot",
                    mediaType: 1,
                    thumbnailUrl: config.thumbUrl,
                    sourceUrl: "https://t.me/musteqeem",
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m });
    }
};