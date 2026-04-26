module.exports = {
    command: 'bank',
    alias: ['aza', 'account', 'sendaza', 'setbank', 'setaza'],
    description: 'View or set bank account details',
    category: 'tools',
    usage: '.bank |.setbank <bank> <number> <name> [phone] [note]',

    execute: async (sock, m, { args, reply, prefix }) => {

        if (!global.bankDetails) {
            global.bankDetails = {
                bankName: '',
                accNumber: '',
                accName: '',
                phone: '',
                note: '',
                setBy: ''
            }
        }

        const command = m.text.split(' ')[0].toLowerCase().replace(prefix, '')
        const isSet = ['setbank', 'setaza'].includes(command)

        if (isSet) {

            if (args.length < 3) {
                return reply(`֎ ✪ *XADON AI • BANK SETUP* ✪ ֎

📝 Usage:
${prefix}${command} <bank> <number> <name> [phone] [note]

Example:
${prefix}${command} Opay 8123456789 John Doe 08012345678 Donation

> ֎`)
            }

            global.bankDetails.bankName = args[0]
            global.bankDetails.accNumber = args[1]

            const remaining = args.slice(2)

            // Smart parsing: last 2 args are phone + note if provided
            if (remaining.length >= 3) {
                global.bankDetails.phone = remaining[remaining.length - 2]
                global.bankDetails.note = remaining[remaining.length - 1]
                global.bankDetails.accName = remaining.slice(0, -2).join(' ')
            } else if (remaining.length === 2) {
                global.bankDetails.phone = remaining[1]
                global.bankDetails.accName = remaining[0]
                global.bankDetails.note = ''
            } else {
                global.bankDetails.accName = remaining.join(' ')
                global.bankDetails.phone = ''
                global.bankDetails.note = ''
            }

            global.bankDetails.setBy = m.sender.split('@')[0]

            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • AZA UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

☬ Set by: ${m.sender.split('@')[0]}

🏦 Bank: ${global.bankDetails.bankName}
💳 Number: ${global.bankDetails.accNumber}
👤 Name: ${global.bankDetails.accName}
${global.bankDetails.phone? `☏ Phone: ${global.bankDetails.phone}\n` : ''}${global.bankDetails.note? `✦ Note: ${global.bankDetails.note}\n` : ''}
> ֎`)
        }

        // View mode
        if (!global.bankDetails.accNumber) {
            return reply(`❌ No AZA set yet\n\nUse ${prefix}setbank to add one\n> ֎`)
        }

        await sock.sendMessage(m.chat, { react: { text: '🏦', key: m.key } });

        let msg = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • BANK DETAILS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🏦 Bank: ${global.bankDetails.bankName}
💳 Account: ${global.bankDetails.accNumber}
👤 Name: ${global.bankDetails.accName}
`

        if (global.bankDetails.phone)
            msg += `☏ Phone: ${global.bankDetails.phone}\n`

        if (global.bankDetails.note)
            msg += `✦ Note: ${global.bankDetails.note}\n`

        if (global.bankDetails.setBy)
            msg += `⚉ Last set by: ${global.bankDetails.setBy}\n`

        msg += `\n💡 Copy & send easily\n\n> ֎`

        reply(msg)
    }
}