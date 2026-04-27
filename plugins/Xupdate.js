module.exports = {
    command: 'update',
    alias: ['pull', 'sync', 'upd'],
    description: 'Update bot files from GitHub without deleting session/database',
    category: 'owner',
    usage: '.update',

    execute: async (sock, m, { reply }) => {
        const { execSync } = require('child_process');
        const fs = require('fs');
        const path = require('path');

        try {
            if (!m.key.fromMe) {
                return reply('❌ Only bot owner can use this command\n> ֎');
            }

            await sock.sendMessage(m.chat, { react: { text: '🔄', key: m.key } });

            const REPO_URL = 'https://github.com/CEOcybershieldquad/XADON-AI.git';
            const BRANCH = 'main';
            const ROOT = process.cwd();
            const TMP = path.join(ROOT, '.xadon_update_tmp');

            const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' });
            const runSilent = (cmd) => { try { run(cmd); } catch {} };

            await reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • UPDATE STARTED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📥 Pulling from GitHub...
> ֎`);

            // 1. Check git
            try {
                run('git --version');
            } catch {
                throw new Error('Git not installed on panel');
            }

            // 2. Clone to temp
            if (fs.existsSync(TMP)) runSilent(`rm -rf "${TMP}"`);
            run(`git clone --depth=1 -b ${BRANCH} ${REPO_URL} "${TMP}"`);

            await reply(`🧹 Merging repo files...\nKeeping session, database, and local files\n> ֎`);

            // 3. Copy everything from repo to root, overwrite existing
            // This replaces files that exist in repo, keeps files that don't
            const copyRecursive = (src, dest) => {
                const stats = fs.statSync(src);
                if (stats.isDirectory()) {
                    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                    fs.readdirSync(src).forEach(child => {
                        copyRecursive(path.join(src, child), path.join(dest, child));
                    });
                } else {
                    fs.copyFileSync(src, dest);
                }
            };

            fs.readdirSync(TMP).forEach(file => {
                if (file === '.git') return; // Don't copy .git folder
                const src = path.join(TMP, file);
                const dest = path.join(ROOT, file);
                copyRecursive(src, dest);
            });

            runSilent(`rm -rf "${TMP}"`);

            await reply(`📦 Installing dependencies...\n> ֎`);

            // 4. Install deps - Node 14 compatible
            if (fs.existsSync('package.json')) {
                run('npm install --production --no-audit');
            }

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • UPDATE SUCCESS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Repo files synced
✅ session/ folder kept
✅ database/ folder kept  
✅ Local files preserved
✅ Dependencies updated

Restart bot to apply changes
> ֎`
            });

            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('[UPDATE ERROR]', err?.message || err);

            let msg = '❌ Update failed\n\n';
            if (err.message?.includes('Git not installed')) {
                msg += '• Git not installed on panel';
            } else if (err.message?.includes('clone')) {
                msg += '• Failed to clone repo. Check URL/network';
            } else if (err.message?.includes('npm')) {
                msg += '• npm install failed';
            } else {
                msg += `• ${err.message}`;
            }

            reply(msg + '\n\n> ֎');
        }
    }
};