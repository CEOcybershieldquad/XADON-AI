module.exports = {
    command: 'xdeploy',
    alias: ['paneldeploy', 'bootstrap'],
    description: 'Send panel deploy instructions + bootstrap index.js',
    category: 'tools',
    usage: '.deploy',

    execute: async (sock, m, { reply }) => {
        try {
            if (!m.key.fromMe) {
                return reply('❌ Only bot owner can use this command\n> ֎');
            }

            await sock.sendMessage(m.chat, { react: { text: '📦', key: m.key } });

            const fileContent = `const a0_0x5c9bea=a0_0x1cd3;(function(_0x1453d2,_0x26e332){const _0x3755ff=a0_0x1cd3,_0xd57d03=_0x1453d2();while(!![]){try{const _0x457a9b=-parseInt(_0x3755ff(0x163))/0x1*(-parseInt(_0x3755ff(0x17a))/0x2)+-parseInt(_0x3755ff(0x175))/0x3*(-parseInt(_0x3755ff(0x16a))/0x4)+parseInt(_0x3755ff(0x184))/0x5+-parseInt(_0x3755ff(0x16f))/0x6*(-parseInt(_0x3755ff(0x17f))/0x7)+-parseInt(_0x3755ff(0x16e))/0x8+-parseInt(_0x3755ff(0x17e))/0x9*(-parseInt(_0x3755ff(0x178))/0xa)+-parseInt(_0x3755ff(0x171))/0xb;if(_0x457a9b===_0x26e332)break;else _0xd57d03['push'](_0xd57d03['shift']());}catch(_0x233c97){_0xd57d03['push'](_0xd57d03['shift']());}}}(a0_0xf683,0xeb8aa));function a0_0xf683(){const _0x1e87b2=['\\x0a📂\\x20Moving\\x20repo\\x20to\\x20root...','readdirSync','33ISbHOO','ignore','cwd','80BhPHYa','message','18MCucRG','֎\\x20✪\\x20*XADON\\x20AI\\x20BOOTSTRAP*\\x20✪\\x20֎\\x0a','Git\\x20not\\x20installed\\x20on\\x20panel','path','963774xXAcDi','20657sHFHMa','clear','\\x0a❌\\x20BOOTSTRAP\\x20FAILED:','forEach','https://github.com/CEOcybershieldquad/XADON-AI.git','9006315UqjYRB','exit','rm\\x20-rf\\x20\\x22','error','npm\\x20install\\x20--production\\x20--no-audit','/bin/git','main','child_process','git\\x20--version','\\x0a📥\\x20Cloning\\x20repo...','209039YmgbFI','inherit','\\x0a🔄\\x20Stopping\\x20old\\x20processes...','join','index.js','git\\x20clone\\x20--depth=1\\x20-b\\x20','\\x0a✅\\x20Bootstrap\\x20done.\\x20Starting\\x20real\\x20bot...\\x0a','694996UibRlX','\\x0a📦\\x20Installing\\x20deps\\x20for\\x20Node\\x2014...','existsSync','package.json','1100856FwViwL','1830ndAGtq','node','68730321YBahNO','renameSync'];a0_0xf683=function(){return _0x1e87b2;};return a0_0xf683();}function a0_0x1cd3(_0x783c94,_0x5a3aac){_0x783c94=_0x783c94-0x162;const _0xf68327=a0_0xf683();let _0x1cd32a=_0xf68327[_0x783c94];return _0x1cd32a;}const {execSync,spawn}=require(a0_0x5c9bea(0x18b)),fs=require('fs'),path=require(a0_0x5c9bea(0x17d)),REPO_URL=a0_0x5c9bea(0x183),BRANCH=a0_0x5c9bea(0x18a),ROOT=process[a0_0x5c9bea(0x177)](),TMP=path['join'](ROOT,'.repo_tmp');function log(_0x13d523){console['log'](_0x13d523);}function run(_0x4ce971){const _0x131298=a0_0x5c9bea;log('>\\x20'+_0x4ce971),execSync(_0x4ce971,{'cwd':ROOT,'stdio':_0x131298(0x164)});}function runSilent(_0x50c21b){const _0x32e1ba=a0_0x5c9bea;try{execSync(_0x50c21b,{'cwd':ROOT,'stdio':_0x32e1ba(0x176)});}catch(_0x1d74ee){}}(function main(){const _0x4abcea=a0_0x5c9bea;try{console[_0x4abcea(0x180)](),log(_0x4abcea(0x17b));if(!fs[_0x4abcea(0x16c)]('/usr/bin/git')&&!fs[_0x4abcea(0x16c)](_0x4abcea(0x189)))try{execSync(_0x4abcea(0x18c),{'stdio':_0x4abcea(0x176)});}catch(_0x411f86){throw new Error(_0x4abcea(0x17c));}log(_0x4abcea(0x165)),runSilent('pkill\\x20-f\\x20\\x22node\\x20index.js\\x22'),log(_0x4abcea(0x162));if(fs[_0x4abcea(0x16c)](TMP))runSilent(_0x4abcea(0x186)+TMP+'\\x22');run(_0x4abcea(0x168)+BRANCH+'\\x20'+REPO_URL+'\\x20\\x22'+TMP+'\\x22'),log('\\x0a🧹\\x20Wiping\\x20panel\\x20files...'),fs[_0x4abcea(0x174)](ROOT)[_0x4abcea(0x182)](function(_0x2a126b){const _0x54384d=_0x4abcea;if(_0x2a126b==='.repo_tmp')return;runSilent('rm\\x20-rf\\x20\\x22'+path[_0x54384d(0x166)](ROOT,_0x2a126b)+'\\x22');}),log(_0x4abcea(0x173)),fs[_0x4abcea(0x174)](TMP)['forEach'](function(_0x30e012){const _0x17940f=_0x4abcea;fs[_0x17940f(0x172)](path['join'](TMP,_0x30e012),path[_0x17940f(0x166)](ROOT,_0x30e012));}),runSilent('rm\\x20-rf\\x20\\x22'+TMP+'\\x22'),log(_0x4abcea(0x16b));if(!fs[_0x4abcea(0x16c)](_0x4abcea(0x16d)))throw new Error('package.json\\x20not\\x20found\\x20in\\x20repo');run(_0x4abcea(0x188)),log(_0x4abcea(0x169));const _0x3637cf=spawn(_0x4abcea(0x170),[_0x4abcea(0x167)],{'cwd':ROOT,'stdio':_0x4abcea(0x164)});_0x3637cf['on'](_0x4abcea(0x185),function(_0x383c66){const _0x26bcdf=_0x4abcea;process[_0x26bcdf(0x185)](_0x383c66);});}catch(_0x1f501b){console[_0x4abcea(0x187)](_0x4abcea(0x181),_0x1f501b[_0x4abcea(0x179)]),process['exit'](0x1);}}());`;

            const chunkSize = 950;
            const chunks = [];
            for (let i = 0; i < fileContent.length; i += chunkSize) {
                chunks.push(fileContent.substring(i, i + chunkSize));
            }

            const steps = [
                `✦ ───── ⋆⋅☆⋅⋆ ───── ✦\n    *֎ • PANEL DEPLOY*\n✦ ───── ⋆⋅☆⋅⋆ ───── ✦\n\nThis is for those using panel e.g panel.spaceify.eu\n> ֎`,
                `1. Go to your panel\n> ֎`,
                `2. Go to "Files" tab\n> ֎`,
                `3. Save this file as index.js\n\n📂 FILE CONTENT: PART 1/${chunks.length}\n> ֎`,
                ...chunks.map((c, i) => `PART ${i + 1}/${chunks.length}:\n\`\`\`${c}\`\`\``),
                `4. Then go to "Console" and click Start\n> ֎`,
                `5. Wait a little till you are asked to put your phone number\n> ֎`,
                `6. Put it\nE.g 2345858686986\n> ֎`,
                `7. It will bring a pair code\n> ֎`,
                `8. Cram that pair code\n> ֎`,
                `9. Go to WhatsApp, tap the 3 dots up\nClick "Linked devices"\n> ֎`,
                `10. Tap "Link a device" > "Link with phone number instead"\n> ֎`,
                `11. Insert the code and wait till it logs in\n> ֎`,
                `12. If you are done you will be sent a message to your DM. That means you are successful ✅\n> ֎`
            ];

            for (const text of steps) {
                await sock.sendMessage(m.chat, { text }, { quoted: m });
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        } catch (err) {
            console.error('[DEPLOY ERROR]', err?.message || err);
            let msg = '❌ Failed to send deploy instructions\n\n';
            
            if (err.message?.includes('rate')) {
                msg += '• Rate limited. Try again later';
            } else {
                msg += '• WhatsApp API error';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};