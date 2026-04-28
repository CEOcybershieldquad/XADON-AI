const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/owners.json');

// Create file if not exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({
        owners: [
            '2349123429926@s.whatsapp.net',
            '2349027879263@s.whatsapp.net'
        ]
    }, null, 2));
}

const getOwners = () => {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8')).owners || [];
    } catch (e) {
        return ['2349123429926@s.whatsapp.net', '2349027879263@s.whatsapp.net'];
    }
};

const isOwner = (sender) => {
    const owners = getOwners();
    return owners.includes(sender) || owners.includes(sender.split('@')[0] + '@s.whatsapp.net');
};

module.exports = {
    command: 'owner',
    alias: ['owner', 'owners'],
    description: 'Owner management (add/remove/list)',
    category: 'owner',
    usage: '.owner add @user | remove @user | list',

    execute: async (sock, m, { args, reply }) => {
        if (!isOwner(m.sender)) {
            return reply('❌ This command is for bot owners only\n> XADON AI');
        }

        // You can expand this later for add/remove owners
        if (!args[0]) {
            const owners = getOwners().map(o => o.split('@')[0]).join('\n');
            return reply(`✪ *XADON AI OWNER COMMANDS* ✪\n\nCurrent Owners:\n${owners}\n\nUse .owner add / remove later\n> XADON AI`);
        }

        return reply('Owner management coming soon...\n> XADON AI');
    }
};