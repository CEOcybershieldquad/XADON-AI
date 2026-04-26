module.exports = {
    command: 'delgc',
    alias: ['deletegc', 'dgc', 'groupdelete', 'kickall'],
    description: 'Delete group chat by kicking everyone and leaving (DANGEROUS)',
    category: 'owner',
    usage: '.delgc',

    execute: async (sock, m, { reply, isOwner }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        if (!isOwner)
            return reply('❌ Only bot owner can use this command\n> XADON AI');

        const chatId = m.chat;

        await sock.sendMessage(m.chat, {
            react: { text: "☠️", key: m.key }
        });

        try {
            // Check if bot is admin first
            const groupMetadata = await sock.groupMetadata(chatId);
            const bot = groupMetadata.participants.find(p => p.id === sock.user.id);

            if (!bot?.admin)
                return reply('❌ Bot must be admin to delete the group\n> XADON AI');

            // Send confirmation message
            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *XADON AI • DELETE GROUP*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⚠️ WARNING: This will kick EVERYONE and delete the group!

Reply *CONFIRM* within 15 seconds to proceed.
Any other reply will cancel.

> XADON AI`
            });

            // Simple confirmation using message collector logic
            // Note: Your handler needs to support this. If not, remove and do manual confirm
            const confirmed = await new Promise((resolve) => {
                const timeout = setTimeout(() => resolve(false), 15000);
                
                const handler = (msg) => {
                    if (msg.key.remoteJid === chatId && 
                        msg.key.participant === m.sender &&
                        msg.message?.conversation?.toLowerCase() === 'confirm') {
                        clearTimeout(timeout);
                        sock.ev.off('messages.upsert', handler);
                        resolve(true);
                    }
                };
                
                sock.ev.on('messages.upsert', handler);
            });

            if (!confirmed)
                return reply('❌ Cancelled / Timed out. Group deletion aborted\n> XADON AI');

            await sock.sendMessage(m.chat, {
                text: '_*⚡ Confirmation received. Starting deletion...*_\n\n> XADON AI'
            });

            // Get fresh metadata
            const freshMeta = await sock.groupMetadata(chatId);
            const participants = freshMeta.participants;

            // Kick all other participants except bot
            const toRemove = participants
                .filter(p => p.id !== sock.user.id && p.admin !== 'superadmin')
                .map(p => p.id);

            if (toRemove.length > 0) {
                await sock.groupParticipantsUpdate(chatId, toRemove, 'remove');
                await new Promise(r => setTimeout(r, 2000)); // Wait for WhatsApp to process
            }

            await sock.sendMessage(m.chat, {
                text: `_*🗑️ Kicked ${toRemove.length} members. Leaving group...*_\n\n> XADON AI`
            });

            // Bot leaves the group
            await sock.groupLeave(chatId);
            console.log(`[DELGC SUCCESS] Bot left group ${chatId}`);

        } catch (err) {

            console.error('[DELGC ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

            let msg = '❌ Failed to delete group\n\n';

            if (err.message?.includes('not-authorized') || err.message?.includes('admin')) {
                msg += '• Bot is not admin or lacks permission';
            } else if (err.message?.includes('rate')) {
                msg += '• Rate limit - WhatsApp blocked the action. Try again later';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};