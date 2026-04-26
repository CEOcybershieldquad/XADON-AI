const fs = require('fs')
const path = require('path')
const { Packer, Document, Paragraph, TextRun } = require('docx')

module.exports = {
    command: 'word',
    alias: ['docx', 'toword', 'text2docx', 'doc'],
    description: 'Convert text to.docx document',
    category: 'documents',
    usage: '.word <text> or reply to text',

    execute: async (sock, m, { args, reply }) => {

        let text = ''

        // Get text from args
        if (args.length > 0) {
            text = args.join(' ')
        }

        // Or fallback to quoted message text
        if (!text && m.quoted) {
            text = (m.quoted.text || m.quoted.caption || '').trim()
        }

        if (!text)
            return reply(`֎ ✪ *XADON AI • WORD* ✪ ֎

📝 Usage:.word <text> or reply to text

Example:.word Hello this is my document
Or reply to text →.word

> ֎`);

        // Limit length
        if (text.length > 10000) {
            text = text.substring(0, 9997) + '...'
        }

        await sock.sendMessage(m.chat, { react: { text: '📄', key: m.key } });

        try {

            // Create DOCX
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: text,
                                    size: 24, // 12pt
                                    font: 'Arial'
                                })
                            ]
                        })
                    ]
                }]
            })

            // Generate buffer
            const buffer = await Packer.toBuffer(doc)

            const fileName = `xadon_doc_${Date.now()}.docx`
            const sizeKB = (buffer.length / 1024).toFixed(2);

            await sock.sendMessage(m.chat, {
                document: buffer,
                mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                fileName: fileName,
                caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • WORD DOCUMENT CREATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⎙ Filename: ${fileName}
⎙ Text length: ${text.length} chars
⎙ Size: ${sizeKB} KB

⚡ Tap to download/open

> ֎`
            }, { quoted: m })

            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (err) {

            console.error('[WORD ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to create.docx document\n\n';

            if (err.message?.includes('docx')) {
                msg += '• Missing docx package. Run: npm install docx';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n\n> ֎');
        }
    }
};