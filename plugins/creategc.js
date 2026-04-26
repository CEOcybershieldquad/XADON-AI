module.exports = {
    command: 'creategc',
    alias: ['creategroup'],
    description: 'Create a new WhatsApp group',
    category: 'owner',
    usage: '.creategc <group name> [@user / reply]',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length)
            return reply(`  *XADON AI  CREATEGC*  

 Usage: .creategc <group name> [@user / reply]

Examples:
 .creategc XADON SQUAD
 .creategc XADON SQUAD @user
 Reply to someone  .creategc XADON SQUAD

Note: If no user is mentioned/replied, only you will be added

> XADON AI`);

        let participants = [m.sender];
        let groupName = args.join(' ').trim();

        // Check for mentions
        if (m.mentionedJid?.length) {
            participants.push(...m.mentionedJid);
            // Remove mentions from group name
            groupName = args.filter(arg => !arg.includes('@')).join(' ').trim();
        
        // Check for reply
        } else if (m.quoted) {
            participants.push(m.quoted.sender);
            groupName = args.join(' ').trim();
        }

        if (!groupName)
            return reply(' Please provide a group name\n> XADON AI');

        if (groupName.length > 100)
            return reply(' Group name cannot exceed 100 characters\n> XADON AI');

        // Remove duplicates
        participants = [...new Set(participants)];

        await sock.sendMessage(m.chat, {
            react: { text: "", key: m.key }
        });

        try {

            const result = await sock.groupCreate(groupName, participants);

            const memberList = participants.map(jid => `@${jid.split('@')[0]}`).join(', ');

            await sock.sendMessage(m.chat, {
                text: `    
    *XADON AI  CREATE GROUP*
    

 Group created: *${result.subject}*
 ID: ${result.id}

 Members: ${memberList}

 Group created successfully

> XADON AI`,
                mentions: participants
            });

            await sock.sendMessage(m.chat, {
                react: { text: "", key: m.key }
            });

        } catch (err) {

            console.error('[CREATEGC ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, {
                react: { text: "", key: m.key }
            });

            let msg = ' Failed to create group\n\n';

            if (err.message?.includes('too many')) {
                msg += ' You have reached the group creation limit';
            } else if (err.message?.includes('banned')) {
                msg += ' Cannot create group at this time';
            } else if (err.message?.includes('participants')) {
                msg += ' Invalid participants or numbers not on WhatsApp';
            } else {
                msg += ` ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};