const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

module.exports = {
    command: 'install',
    alias: ['inst', 'addplg'],
    description: 'Install plugin from GitHub Gist raw URL (owner only)',
    category: 'tools',
    usage: '.install <raw-gist-url>',
    owner: true,   // ← restrict to bot owner

    execute: async (sock, m, { args, reply, isOwner }) => {

        const url = args[0];
        if (!url) return reply('📌 Provide raw Gist URL!\nExample: .install https://gist.githubusercontent.com/.../raw/...js');

        }

        await reply('⏳ Fetching plugin from Gist...');

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const code = await response.text();

            // Basic validation: should look like a plugin (module.exports + command/execute)
            if (!code.includes('module.exports') || !code.includes('execute:')) {
                return reply('❌ Code doesn’t look like a valid plugin (missing module.exports or execute).');
            }

            // Get filename from URL or fallback
            let filename = url.split('/').pop();
            if (!filename.endsWith('.js')) filename += '.js';

            // Sanitize filename (prevent weird chars / traversal)
            filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

            const pluginsDir = './plugins';          // ← CHANGE TO './container/plugins' if needed
            const filePath = path.join(pluginsDir, filename);

            // Optional: check if already exists
            if (fs.existsSync(filePath)) {
                return reply(`⚠️ Plugin '${filename}' already exists!\nOverwrite? Use .installforce <url>`);
            }

            fs.writeFileSync(filePath, code, 'utf8');

            reply(`✅ Plugin installed!\n\n` +
                  `📁 Saved as: ${filename}\n` +
                  `📂 Path: ${filePath}\n\n` +
                  `Now send *.reload*, *.refresh*, or *.r* (depends on your bot)`);

        } catch (err) {
            console.error('[INSTALL ERROR]', err);
            reply(`❌ Failed: ${err.message || 'Unknown error'}`);
        }
    }
};