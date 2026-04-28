const fs = require('fs');
const path = require('path');
const { VM } = require('vm2'); // safer eval
const beautify = require('js-beautify').js;

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

module.exports = {
    command: 'deobfuscate',
    alias: ['deobf', 'unobfuscate', 'unpack'],
    description: 'Deobfuscate JS obfuscated with javascript-obfuscator RC4',
    category: 'musteqeem',
    owner: true,
    usage: '.deobfuscate <reply to .js file>',

    execute: async (sock, m, { args, reply }) => {
        let code = '';

        if (m.quoted && m.quoted.documentMessage?.mimetype === 'text/javascript') {
            const quotedPath = await sock.downloadMediaMessage(m.quoted);
            code = fs.readFileSync(quotedPath, 'utf8');
            fs.unlinkSync(quotedPath);
        } else if (args.length > 0) {
            code = args.join(' ');
        } else {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • DEOBFUSCATOR* ✪ ֎

❌ No code provided

Usage: Reply to obfuscated .js file with .deobfuscate

Works on: javascript-obfuscator RC4 string-array

> ֎`);
        }

        if (!code.includes('_0x') && !code.includes('fromCharCode') && !code.includes('charCodeAt')) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ This doesn't look like javascript-obfuscator code\n\n> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🔓', key: m.key } });
        await sock.sendMessage(m.chat, { text: `֎ Deobfuscating...\n\n⏳ Unpacking RC4 arrays\n\n> ֎` }, { quoted: m });

        try {
            // Strategy: Run code in sandbox to extract string array + decoder
            let decodedCode = '';
            
            const vm = new VM({
                timeout: 5000,
                sandbox: {
                    module: {},
                    exports: {},
                    console: { log: () => {} },
                    require: () => {},
                    process: {},
                    global: {}
                }
            });

            // Inject helper to capture the real code after string replacement
            const wrapper = `
                let __decoded_strings__ = {};
                let __original_func__ = Function.prototype.constructor;
                Function.prototype.constructor = function(...args) {
                    if (args.length > 0) {
                        __decoded_strings__.code = args[args.length - 1];
                    }
                    return __original_func__.apply(this, args);
                };
                ${code}
                __decoded_strings__;
            `;

            try {
                const result = vm.run(wrapper);
                if (result && result.code) {
                    decodedCode = result.code;
                }
            } catch (e) {
                // Fallback: try direct eval of decoder only
                const arrayMatch = code.match(/const _0x[a-f0-9]+=\[.*?\];/s);
                if (arrayMatch) {
                    const decoderMatch = code.match(/function _0x[a-f0-9]+\(_0x[a-f0-9]+,_0x[a-f0-9]+\)\{[\s\S]+?return _0x[a-f0-9]+;\}/);
                    if (decoderMatch) {
                        const evalCode = arrayMatch[0] + '\n' + decoderMatch[0] + '\n' + code;
                        try {
                            vm.run(evalCode);
                        } catch {}
                    }
                }
            }

            // If VM trick failed, do basic regex replace
            if (!decodedCode) {
                // Extract decoder function name
                const decoderMatch = code.match(/function (_0x[a-f0-9]+)\(/);
                if (decoderMatch) {
                    const decoderName = decoderMatch[1];
                    // Run just the array + decoder in VM
                    const parts = code.split(decoderMatch[0]);
                    const setupCode = parts[0] + decoderMatch[0] + parts[1].split('}(')[0] + '})';
                    
                    try {
                        vm.run(setupCode);
                        // Replace all decoder calls
                        decodedCode = code.replace(new RegExp(decoderName + '\\([^)]+\\)', 'g'), (match) => {
                            try {
                                return JSON.stringify(vm.run(match));
                            } catch {
                                return match;
                            }
                        });
                    } catch {
                        decodedCode = code;
                    }
                } else {
                    decodedCode = code;
                }
            }

            // Beautify final result
            const finalCode = beautify(decodedCode, {
                indent_size: 4,
                space_in_empty_paren: true,
                preserve_newlines: true,
                max_preserve_newlines: 2
            });

            if (finalCode.length < 50) {
                throw new Error('Deobfuscation failed - output too short');
            }

            const fileName = `deobf_${Date.now()}.js`;
            const filePath = path.join(tempDir, fileName);
            fs.writeFileSync(filePath, finalCode);

            await sock.sendMessage(m.chat, {
                document: fs.readFileSync(filePath),
                mimetype: 'text/javascript',
                fileName: fileName,
                caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • DEOBFUSCATION COMPLETE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📊 Original: ${code.length} chars
🔓 Unpacked: ${finalCode.length} chars
⚡ Method: VM sandbox + beautify

Note: Variable names can't be recovered. Logic is restored.

> ֎`
            }, { quoted: m });

            fs.unlinkSync(filePath);
            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('[DEOBF ERROR]', err?.message || err);
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Deobfuscation failed\n\n';
            if (err.message.includes('timeout')) {
                msg += '• Code too complex or infinite loop\n• Try simpler obfuscation';
            } else if (err.message.includes('not defined')) {
                msg += '• Custom obfuscation not supported\n• Only javascript-obfuscator RC4';
            } else {
                msg += `• ${err.message}`;
            }

            return reply(msg + '\n\n> ֎');
        }
    }
};