const axios = require('axios');

module.exports = {
    command: 'npminfo',
    alias: ['package', 'npmjs', 'npm'],
    description: 'Get NPM package information and stats',
    category: 'search',
    usage: '.npminfo <package-name>',

    execute: async (sock, m, { args, reply }) => {

        const pkg = args[0]?.trim();

        if (!pkg)
            return reply(`֎ ✪ *XADON AI • NPM INFO* ✪ ֎

📦 Usage:.npminfo <package>

Examples:
-.npminfo axios
-.npminfo react
-.npminfo @whiskeysockets/baileys

> ֎`);

        await sock.sendMessage(m.chat, { react: { text: '📦', key: m.key } });

        try {
            // Handle scoped packages
            const encodedPkg = pkg.startsWith('@')? pkg.replace('/', '%2F') : pkg;

            const res = await axios.get(`https://registry.npmjs.org/${encodedPkg}`, {
                timeout: 10000,
                headers: { 'Accept': 'application/json' }
            });

            const data = res.data;

            // Get latest version
            const latestVersion = data['dist-tags']?.latest || Object.keys(data.versions || {}).pop();
            const latest = data.versions?.[latestVersion] || {};

            // Format data
            const name = data._id || data.name || pkg;
            const description = data.description || latest.description || 'No description';
            const version = latestVersion || 'N/A';
            const license = latest.license || data.license || 'N/A';
            const author = data.author?.name || latest.author?.name || 'N/A';
            const keywords = (latest.keywords || data.keywords || []).slice(0, 5).join(', ') || 'None';
            const homepage = data.homepage || latest.homepage || 'N/A';
            const repository = data.repository?.url || latest.repository?.url || 'N/A';

            // Get download count
            let downloads = 'N/A';
            try {
                const dlRes = await axios.get(`https://api.npmjs.org/downloads/point/last-week/${encodedPkg}`, { timeout: 8000 });
                downloads = dlRes.data?.downloads?.toLocaleString() || 'N/A';
            } catch {}

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • NPM PACKAGE INFO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📦 Package: ${name}
📝 Description: ${description.length > 80? description.slice(0, 77) + '...' : description}
🏷️ Version: v${version}
📥 Weekly Downloads: ${downloads}
📄 License: ${license}
👤 Author: ${author}
🔑 Keywords: ${keywords}
🌐 Homepage: ${homepage.length > 50? homepage.slice(0, 47) + '...' : homepage}
📂 Repository: ${repository.length > 50? repository.slice(0, 47) + '...' : repository}

💡 Install: npm i ${name}

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[NPM ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to fetch package info\n\n';

            if (err.response?.status === 404) {
                msg += `• Package not found: "${pkg}"`;
            } else if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Try again';
            } else {
                msg += '• Check package name and try again';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};