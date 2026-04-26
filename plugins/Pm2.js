const { exec } = require('child_process');

const util = require('util');

const execPromise = util.promisify(exec);

module.exports = {

    command: 'pm2',

    alias: ['process', 'botctl'],

    description: 'Manage XADON AI process with PM2',

    category: 'owner',

    ownerOnly: true,

    execute: async (sock, m, { text, reply }) => {

        if (!text) {

            return reply(

                '⚙️ *PM2 CONTROL*\n\n' +

                'Usage:\n' +

                '._pm2 start_ → Start XADON under PM2\n' +

                '._pm2 restart_ → Restart (auto-start if not running)\n' +

                '._pm2 stop_ → Stop XADON\n'

            );

        }

        const cmdText = text.trim().toLowerCase();

        let cmd = '';

        let workingMsg = '';

        let successMsg = '';

        switch (cmdText) {

            case 'start':

                cmd = 'npx pm2 start index.js --name XADON';

                workingMsg = '_✪ Starting XADON..._';

                successMsg = '*✓ XADON started!*';

                break;

            case 'restart':

                cmd = 'npx pm2 restart XADON || npx pm2 start index.js --name XADON';

                workingMsg = '_✪ Restarting XADON..._';

                successMsg = '*✓ XADON restarted!*';

                break;

            case 'stop':

                cmd = 'npx pm2 stop XADON || echo "XADON not running"';

                workingMsg = '_✪ Stopping XADON..._';

                successMsg = '*✓ XADON stopped!*';

                break;

            default:

                return reply('✘ Unknown command. Use start | restart | stop');

        }

        await reply(workingMsg + '\n`' + cmd + '`');

        try {

            const { stdout, stderr } = await execPromise(cmd, { cwd: process.cwd() });

            let output = (stdout + stderr).trim();

            if (output.length > 3500) output = output.substring(0, 3400) + '\n(truncated)';

            await reply(successMsg + '\n```\n' + output + '\n```');

        } catch (err) {

            let errMsg = err.message || 'Unknown error';

            if (err.stdout) errMsg += '\n' + err.stdout.substring(0, 1000);

            await reply('✘ Failed:\n```\n' + errMsg + '\n```');

        }

    }

};