const axios = require('axios');
const FormData = require('form-data');
const { getVar } = require('../Plugin/configManager'); // your config system

/**
 * Remove background from image
 * @param {Buffer} imageBuffer
 * @param {Function} reply
 */
async function removeBackground(imageBuffer, reply) {

    const API_KEY = getVar('REMOVE_BG_API_KEY') || process.env.REMOVE_BG_API_KEY;

    // ❌ No API key
    if (!API_KEY) {
        return await reply(
`╭─❍ *XADON AI • REMOVE BG*
│ ✘ API Key Missing!
│
│ ✦ Get API Key:
│ https://www.remove.bg/
│
│ ✦ Set it using:
│ .setvar REMOVE_BG_API_KEY=your_key
╰──────────────────`
        );
    }

    try {

        const form = new FormData();
        form.append('image_file', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });

        form.append('size', 'auto');

        const res = await axios.post(
            'https://api.remove.bg/v1.0/removebg',
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    'X-Api-Key': API_KEY
                },
                responseType: 'arraybuffer',
                timeout: 30000
            }
        );

        return Buffer.from(res.data);

    } catch (err) {
        console.log('[REMOVE BG ERROR]', err.message);

        await reply(
`❌ Failed to remove background
> XADON AI`
        );
    }
}

module.exports = { removeBackground };