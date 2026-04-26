const crypto = require('crypto');

module.exports = {
    command: 'encode',
    alias: ['enc'],
    description: 'Encode text or file (multi-format)',
    category: 'tools',
    usage: '.encode type text / reply',

    execute: async (sock, m, { args, reply }) => {

        const type = args[0]?.toLowerCase();

        if (!type)
            return reply(`✨ ✪ *XADON AI • ENCODER* ✪ ✨

🔐 Types:
• base64 • hex • binary • url
• base32 • rot13
• md5 • sha1 • sha256
• nodejs

📌 Usage:
• .encode base64 hello
• Reply text/file → .encode base64

> XADON AI`);

        let input;

        try {

            // ✅ GET INPUT (TEXT OR REPLY)
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

            let result;

            switch (type) {

                case 'base64':
                    result = Buffer.from(input).toString('base64');
                    break;

                case 'hex':
                    result = Buffer.from(input).toString('hex');
                    break;

                case 'binary':
                    result = input
                        .split('')
                        .map(c => c.charCodeAt(0).toString(2))
                        .join(' ');
                    break;

                case 'url':
                    result = encodeURIComponent(input);
                    break;

                case 'rot13':
                    result = input.replace(/[a-zA-Z]/g, c =>
                        String.fromCharCode(
                            (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13)
                                ? c
                                : c - 26
                        )
                    );
                    break;

                case 'md5':
                    result = crypto.createHash('md5').update(input).digest('hex');
                    break;

                case 'sha1':
                    result = crypto.createHash('sha1').update(input).digest('hex');
                    break;

                case 'sha256':
                    result = crypto.createHash('sha256').update(input).digest('hex');
                    break;

                case 'base32':
                    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
                    let bits = "";
                    for (let i = 0; i < input.length; i++) {
                        bits += input.charCodeAt(i).toString(2).padStart(8, '0');
                    }
                    result = bits.match(/.{1,5}/g)
                        .map(bin => alphabet[parseInt(bin.padEnd(5, '0'), 2)])
                        .join('');
                    break;

                case 'nodejs':
                    const b64 = Buffer.from(input).toString('base64');
                    result = `// XADON AI OBFUSCATED
eval(Buffer.from("${b64}", "base64").toString())`;
                    break;

                default:
                    return reply('❌ Unknown encode type\n> XADON AI');
            }

            // 📦 HANDLE LONG OUTPUT
            if (result.length > 4000) {
                return reply(`📦 Encoded Output (trimmed):

${result.slice(0, 4000)}...

⚠️ Too long

> XADON AI`);
            }

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • ENCODE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔐 Type: ${type.toUpperCase()}

📄 Result:
${result}

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "🔐", key: m.key }
            });

        } catch (err) {

            console.error('[ENCODE ERROR]', err);

            reply(`❌ Encoding failed

• ${err.message}

> XADON AI`);
        }
    }
};