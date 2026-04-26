import config from '../../config.js';

export default {
    name: 'support',
    aliases: ['supportgroup', 'helpgroup'],
    category: 'general',
    description: 'Get the support group link',
    usage: 'support',
    cooldown: 5,
    permissions: ['user'],

    async execute({ sock, message, from }) {
        const supportGroup = config.supportGroup || 'https://chat.whatsapp.com/YOUR_GROUP_LINK';
        
        const supportText = `╭──⦿【 🆘 SUPPORT GROUP 】
│
│ 💬 𝗡𝗲𝗲𝗱 𝗛𝗲𝗹𝗽?
│ Join our support group for:
│
│ ✅ Bot assistance
│ ✅ Feature requests
│ ✅ Bug reports
│ ✅ Updates & announcements
│ ✅ Community support
│
│ 🔗 𝗚𝗿𝗼𝘂𝗽 𝗟𝗶𝗻𝗸:
│ ${supportGroup}
│
│ 👨‍💻 𝗢𝘄𝗻𝗲𝗿: ${config.ownerName}
│ 🌐 𝗪𝗲𝗯𝘀𝗶𝘁𝗲: ${config.botWebsite}
│
╰────────────⦿

💡 Click the link above to join our community!`;

        await sock.sendMessage(from, {
            text: supportText
        }, { quoted: message });
    }
};
