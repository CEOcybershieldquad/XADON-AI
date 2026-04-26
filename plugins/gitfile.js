const axios = require('axios');

module.exports = {
    command: 'gitfile',
    aliases: ['repozip', 'ziprepo'],
    category: 'tools',
    description: 'Download GitHub repo as ZIP',
    usage: '.gitfile https://github.com/user/repo',

    execute: async (sock, m, { args, reply }) => {

        if (!args[0]) {
            return reply(`✨ ✪ *XADON AI • GITFILE* ✪ ✨

📦 Provide GitHub repo link

Example:
.gitfile https://github.com/user/repo

> XADON AI`);
        }

        let url = args[0].replace('.git', '').replace(/\/$/, '');
        
        if (!url.includes('github.com')) {
            return reply('❌ Invalid GitHub URL\n> XADON AI');
        }

        try {
            const zipUrl = url + '/archive/refs/heads/main.zip';

            await reply(`⚡ Preparing ZIP download...

📦 Repo:
${url}

> XADON AI`);

            await sock.sendMessage(m.chat, {
                document: { url: zipUrl },
                mimetype: 'application/zip',
                fileName: `${url.split('/').pop()}.zip`,
                caption: `✨ ✪ *XADON AI • REPO ZIP* ✪ ✨

✅ Download ready

> XADON AI`
            }, { quoted: m });

        } catch (err) {
            reply(`❌ Failed to fetch repo\n${err.message}\n> XADON AI`);
        }
    }
};