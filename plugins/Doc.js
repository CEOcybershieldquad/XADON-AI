module.exports = {
    command: 'doc',
    aliases: ['document', 'todoc', 'senddoc', 'file', 'docx', 'upload'],
    category: 'documents',
    description: 'Convert replied media → downloadable document with custom name',
    
    // ─── 2026 Neon / Cyberpunk Config ───
    theme: {
        primary: '✦',
        accent: '⚡',
        success: '📜',
        error: '⛔',
        thinking: '✨',
        wait: '⏳'
    },

    // Optional cooldown / ratelimit (in seconds)
    cooldown: 8,

    execute: async (sock, m, { args, q, prefix, command, reply, isMedia }) => {
        const { theme } = module.exports;

        // ─── Visual helpers ───
        const neonBox = (title) => `╭─═━✦ ${title.toUpperCase()} ✦━═─╮`;
        const neonLine = '│';
        const neonFoot = '╰─═━✦═══════✦━═─╯';
        const spacer   = '  ';

        try {
            // ─── 1. Input validation ───
            if (!m.quoted) {
                return reply(
                    `${neonBox('MEDIA REQUIRED')}\n` +
                    `Reply to image / video / audio / sticker / pdf\n` +
                    `Example: ${prefix + command} My Vacation 2026\n` +
                    neonFoot
                );
            }

            const quoted = m.quoted;
            const mime = quoted.mimetype || quoted.msg?.mimetype || '';

            if (!mime) {
                return reply(
                    `${neonBox('NO MEDIA DETECTED')}\n` +
                    `Replied message contains no downloadable media\n` +
                    neonFoot
                );
            }

            // ─── 2. Smart filename + extension logic ───
            let filename = (q?.trim() || `XADON_${Date.now().toString(36).toUpperCase()}`);
            let ext = 'bin';

            const mimeMap = {
                'image/':           'jpg',
                'video/':           'mp4',
                'audio/':           'mp3',
                'image/webp':       'webp',
                'application/pdf':  'pdf',
                'audio/ogg':        'ogg',
                'application/vnd.openxmlformats-officedocument': 'docx',
                'application/msword': 'doc',
                'text/plain':       'txt'
            };

            for (const [key, value] of Object.entries(mimeMap)) {
                if (mime.startsWith(key) || mime === key) {
                    ext = value;
                    break;
                }
            }

            if (!filename.toLowerCase().endsWith(`.${ext}`)) {
                filename += `.${ext}`;
            }

            // ─── 3. Stage 1 ─ Preparing ───
            await reply(
                `${theme.thinking} ${neonBox('INITIALIZING')}\n` +
                `Media detected • ${mime.split('/')[0].toUpperCase() || 'UNKNOWN'}\n` +
                `Filename → ${filename}\n` +
                `Converting to document...\n` +
                neonFoot
            );

            // Fake progress (2026 premium feel)
            await sock.sendMessage(m.chat, { 
                react: { text: theme.wait, key: m.key } 
            });

            // ─── 4. Download buffer ───
            const buffer = await quoted.download().catch(() => null);

            if (!buffer || buffer.length < 512) {
                return reply(
                    `${theme.error} ${neonBox('DOWNLOAD FAILED')}\n` +
                    `Media buffer corrupted or too small\n` +
                    `Try replying to a different media\n` +
                    neonFoot
                );
            }

            // ─── 5. Optional thumbnail (for images/videos) ───
            let thumbnail = null;
            if (mime.startsWith('image/') || mime.startsWith('video/')) {
                try {
                    thumbnail = await quoted.downloadThumb?.() || null;
                } catch {}
            }

            // ─── 6. Stage 2 ─ Sending ───
            await sock.sendMessage(m.chat, {
                react: { text: theme.accent, key: m.key }
            });

            await sock.sendMessage(m.chat, {
                document: buffer,
                mimetype: mime,
                fileName: filename,
                thumbnail, // works on many clients (WhatsApp shows preview)
                caption: 
                    `✦════ ⋆⋅ XADON NEON PROTOCOL ⋅⋆ ════✦\n` +
                    `❖ File     : ${filename}\n` +
                    `❖ Type     : ${mime.split('/')[1]?.toUpperCase() || mime}\n` +
                    `❖ Size     : ${(buffer.length / 1024 / 1024).toFixed(2)} MB\n` +
                    `❖ Generated: ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}\n` +
                    `✦═══════════════════════════════════════✦\n` +
                    `Powered by XADON AI • Lagos 2026`
            }, { quoted: m });

            // ─── Final success ───
            await reply(
                `${theme.success} ${neonBox('TRANSMISSION COMPLETE')}\n` +
                `\( {neonLine} \){spacer}Document saved as → ${filename}\n` +
                `\( {neonLine} \){spacer}Tap filename to download\n` +
                `\( {neonLine} \){spacer}XADON NEON PROTOCOL • STABLE\n` +
                neonFoot
            );

            // Cleanup reaction
            await sock.sendMessage(m.chat, {
                react: { text: theme.success, key: m.key }
            });

        } catch (err) {
            console.error('[XADON-DOC-ERROR]', err.message, err.stack?.slice(0, 200));

            await reply(
                `${theme.error} ${neonBox('CRITICAL ERROR')}\n` +
                `\( {neonLine} \){spacer}${err.message?.slice(0, 90) || 'Unexpected failure'}\n` +
                `\( {neonLine} \){spacer}Please try again or contact admin\n` +
                neonFoot
            );

            // Error reaction
            await sock.sendMessage(m.chat, {
                react: { text: theme.error, key: m.key }
            });
        }
    }
};