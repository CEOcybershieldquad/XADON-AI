const crypto = require('crypto');

module.exports = {
    command: 'mencode',
    alias: ['enc'],
    description: 'Multi-layer encode text or file',
    category: 'tools',
    usage: '.encode type1+type2 text / reply',

    execute: async (sock, m, { args, reply }) => {

        const chain = args[0]?.toLowerCase();

        if (!chain)
            return reply(`✨ ✪ *XADON AI • MULTI ENCODER* ✪ ✨

🔗 Example:
• .mencode base64+hex hello
• .mencode rot13+base64 text
• Reply → .encode base64+sha256

🔐 Types:
base64, hex, binary, url,
base32, rot13,
md5, sha1, sha256,
nodejs

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

            let result = input;

            // 🔁 APPLY MULTI ENCODE
            for (let type of types) {

                switch (type) {

                    case 'base64':
                        result = Buffer.from(result).toString('base64');
                        break;

                    case 'hex':
                        result = Buffer.from(result).toString('hex');
                        break;

                    case 'binary':
                        result = result
                            .split('')
                            .map(c => c.charCodeAt(0).toString(2))
                            .join(' ');
                        break;

                    case 'url':
                        result = encodeURIComponent(result);
                        break;

                    case 'rot13':
                        result = result.replace(/[a-zA-Z]/g, c =>
                            String.fromCharCode(
                                (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13)
                                    ? c
                                    : c - 26
                            )
                        );
                        break;

                    case 'md5':
                        result = crypto.createHash('md5').update(result).digest('hex');
                        break;

                    case 'sha1':
                        result = crypto.createHash('sha1').update(result).digest('hex');
                        break;

                    case 'sha256':
                        result = crypto.createHash('sha256').update(result).digest('hex');
                        break;

                    case 'base32':
                        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
                        let bits = "";
                        for (let i = 0; i < result.length; i++) {
                            bits += result.charCodeAt(i).toString(2).padStart(8, '0');
                        }
                        result = bits.match(/.{1,5}/g)
                            .map(bin => alphabet[parseInt(bin.padEnd(5, '0'), 2)])
                            .join('');
                        break;

                    case 'nodejs':
                        const b64 = Buffer.from(result).toString('base64');
                        result = `// XADON AI OBFUSCATED
eval(Buffer.from("${b64}", "base64").toString())`;
                        break;

                    default:
                        return reply(`❌ Unknown type: ${type}\n> XADON AI`);
                }
            }

            // 📦 HANDLE LONG OUTPUT
            if (result.length > 4000) {
                return reply(`📦 Multi Encoded (trimmed):

${result.slice(0, 4000)}...

⚠️ Output too long

> XADON AI`);
            }

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • MULTI ENCODE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔗 Chain: ${types.join(' → ')}

📄 Result:
${result}

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "⚡", key: m.key }
            });

        } catch (err) {

            console.error('[MULTI ENCODE ERROR]', err);

            reply(`❌ Encoding failed

• ${err.message}

> XADON AI`);
        }
    }
};