const { exec } = require('child_process');

module.exports = {
    command: 'shell',
    aliases: ['sh', 'bash', 'term', 'exec', '$'],
    category: 'owner',
    description: 'Execute shell commands directly (owner only - high risk)',
    usage: 'shell <command>',
    owner: true,

  execute: async (sock, m, { args, reply }) => {
        try {
            // Owner check using bot's own JID
            const ownerJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            if (m.key.participant !== ownerJid && !m.key.fromMe) {
                return extra.reply("🚫 This command is restricted to the bot owner only.");
            }

            const cmd = args.join(' ').trim();
            if (!cmd) {
                return extra.reply(
                    "🖥️ *XADON Shell Usage Guide*\n\n" +
                    `${extra.prefix || '.'}shell <command>\n\n` +
                    "Examples:\n" +
                    "• shell ls -la\n" +
                    "• shell node -v\n" +
                    "• shell pwd\n" +
                    "• shell npm install axios\n\n" +
                    "⚠️ Use responsibly — dangerous commands are blocked.\n" +
                    "Type 'shell history' to see recent commands."
                );
            }

            // Special: show command history
            if (cmd.toLowerCase() === 'history') {
                const history = global.shellHistory?.[ownerJid] || [];
                if (!history.length) return extra.reply("No command history yet.");

                let histText = "📜 *Recent Shell Commands*\n\n";
                history.forEach((entry, i) => {
                    histText += `${i+1}. ${entry.cmd}\n   └─ ${entry.time}\n\n`;
                });
                return extra.reply(histText);
            }

            // Block dangerous commands
            const dangerousPatterns = [
                /rm\s+-rf/i, /:(){:|:&};:/, /fork\s+bomb/i,
                /shutdown/i, /reboot/i, /halt/i, /poweroff/i,
                /init\s+0/i, /init\s+6/i, /mkfs/i, /dd\s+if=\/dev\/zero/i,
                /format/i, />\s*\/dev\/null/i, /chmod\s+777\s+-R/i,
                /sudo/i, /su/i, /del\s+\/f/i, /rd\s+\/s/i, /taskkill/i
            ];

            if (dangerousPatterns.some(p => p.test(cmd))) {
                return extra.reply(
                    "🚫 **Dangerous command blocked!**\n\n" +
                    "This command could delete files, crash the system, or cause permanent damage.\n" +
                    "Rewrite without risky patterns if you're sure it's safe."
                );
            }

            // React + typing
            await sock.sendMessage(m.chat, { react: { text: "⚙️", key: m.key } });
            await sock.sendPresenceUpdate('composing', m.chat);

            // Save to history (keep last 10)
            global.shellHistory = global.shellHistory || {};
            global.shellHistory[ownerJid] = global.shellHistory[ownerJid] || [];
            global.shellHistory[ownerJid].unshift({
                cmd,
                time: new Date().toLocaleString()
            });
            if (global.shellHistory[ownerJid].length > 10) {
                global.shellHistory[ownerJid].pop();
            }

            // Execute safely
            const startTime = Date.now();

            const { stdout, stderr } = await new Promise((resolve, reject) => {
                const child = exec(cmd, {
                    timeout: 30000,           // 30 seconds max
                    maxBuffer: 1024 * 1024,   // 1MB buffer
                    shell: '/bin/bash',
                    cwd: process.cwd()
                });

                let out = '';
                let err = '';

                child.stdout.on('data', d => out += d);
                child.stderr.on('data', d => err += d);

                child.on('close', code => resolve({ stdout: out.trim(), stderr: err.trim(), code }));
                child.on('error', reject);
            });

            const execTime = Date.now() - startTime;

            let output = `╭─𖣔─𖣘【 XADON SHELL 】\n`;
            output += `│ 📝 Command: \`${cmd}\`\n`;
            output += `│ ⏱️ Time: ${execTime}ms\n`;
            output += `│\n`;

            if (stdout) {
                const truncated = stdout.length > 3500 
                    ? stdout.substring(0, 3500) + '\n... [truncated]' 
                    : stdout;
                output += `│ 📤 Output:\n\`\`\`\n${truncated}\n\`\`\`\n`;
            }

            if (stderr) {
                const truncated = stderr.length > 3500 
                    ? stderr.substring(0, 3500) + '\n... [truncated]' 
                    : stderr;
                output += `│ ⚠️ Stderr:\n\`\`\`\n${truncated}\n\`\`\`\n`;
            }

            if (!stdout && !stderr) {
                output += `│ ✅ Success (no output)\n`;
            }

            output += `╰─✯─────✰─────✰─⦿`;

            // Send result (split if too long)
            if (output.length > 4000) {
                const parts = output.match(/.{1,4000}/g);
                for (const part of parts) {
                    await sock.sendMessage(m.chat, { text: part }, { quoted: m });
                    await new Promise(r => setTimeout(r, 800));
                }
            } else {
                await sock.sendMessage(m.chat, { text: output }, { quoted: m });
            }

            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (err) {
            console.error('shell error:', err);

            let msg = "❌ Shell execution failed.";

            if (err.code === 'ETIMEDOUT') {
                msg += "\nCommand timed out after 30 seconds.";
            } else if (err.code) {
                msg += `\nExit code: ${err.code}`;
            }

            if (err.stderr) {
                const truncated = err.stderr.length > 2000 
                    ? err.stderr.substring(0, 2000) + '\n...[truncated]' 
                    : err.stderr;
                msg += `\n\nStderr:\n\`\`\`\n${truncated}\n\`\`\``;
            } else if (err.message) {
                msg += `\n\n${err.message}`;
            }

            await extra.reply(msg);
            await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        }
    }
};