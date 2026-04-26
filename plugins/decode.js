const crypto = require('crypto');

module.exports = {
    command: 'decode',
    alias: ['dec'],
    description: 'Multi-layer decode text or file',
    category: 'tools',
    usage: '.decode type1+type2 text / reply',

    execute: async (sock, m, { args, reply }) => {

        const chain = args[0]?.toLowerCase();

        if (!chain)
            return reply(`✨ ✪ *XADON AI • MULTI DECODER* ✪ ✨

🔗 Example:
• .decode base64+hex text
• Reply → .decode base64+rot13

🔐 Types:
base64, hex, binary, url, rot13, base32, nodejs

> XADON AI`);

        const types = chain.split('+');
        let input;

        try {
            // ✅ GET INPUT
            if (m.quoted) {
                if (m.quoted.text) {
                    input = m.quoted.text;
                } else {
                    const buffer = await m.quoted.download();
                    input = buffer.toString();
                }
            } else {
                input = args.slice(1).join(' ');
            }

            if (!input)
                return reply('⚠️ No input found\n> XADON AI');

            // 🔁 APPLY MULTI DECODE IN REVERSE ORDER
            let result = input;

            for (let i = types.length - 1; i >= 0; i--) {
                const type = types[i];

                switch (type) {

                    case 'base64':
                        result = Buffer.from(result, 'base64').toString();
                        break;

                    case 'hex':
                        result = Buffer.from(result, 'hex').toString();
                        break;

                    case 'binary':
                        result = result.split(' ')
                            .map(b => String.fromCharCode(parseInt(b, 2)))
                            .join('');
                        break;

                    case 'url':
                        result = decodeURIComponent(result);
                        break;

                    case 'rot13':
                        result = result.replace(/[a-zA-Z]/g, c =>
                            String.fromCharCode(
                                (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) - 13)
                                    ? c
                                    : c + 26
                            )
                        );
                        break;

                    case 'base32':
                        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
                        let bits = '';
                        for (let char of result) {
                            const idx = alphabet.indexOf(char.toUpperCase());
                            if (idx === -1) continue;
                            bits += idx.toString(2).padStart(5, '0');
                        }
                        result = bits.match(/.{1,8}/g)
                            .map(b => String.fromCharCode(parseInt(b, 2)))
                            .join('');
                        break;

                    case 'nodejs':
                        // extract eval code from XADON AI wrapper
                        const match = result.match(/Buffer\.from\("(.+?)", "base64"\)/);
                        if (!match) throw new Error('Invalid nodejs wrapper');
                        result = Buffer.from(match[1], 'base64').toString();
                        break;

                    default:
                        return reply(`❌ Unknown decode type: ${type}\n> XADON AI`);
                }
            }

            if (result.length > 4000) {
                return reply(`📦 Decoded Output (trimmed):

${result.slice(0, 4000)}...

⚠️ Too long

> XADON AI`);
            }

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • MULTI DECODE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔗 Chain: ${types.join(' → ')}

📄 Result:
${result}

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "🔓", key: m.key }
            });

        } catch (err) {

            console.error('[MULTI DECODE ERROR]', err);

            reply(`❌ Decoding failed

• ${err.message}

> XADON AI`);
        }
    }
};