console.clear();
const config = () => require('./settings/config');
process.on("uncaughtException", console.error);

let makeWASocket, Browsers, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, jidDecode, downloadContentFromMessage, jidNormalizedUser, isPnUser;

const loadBaileys = async () => {
  const baileys = await import('@whiskeysockets/baileys');
  
  makeWASocket = baileys.default;
  Browsers = baileys.Browsers;
  useMultiFileAuthState = baileys.useMultiFileAuthState;
  DisconnectReason = baileys.DisconnectReason;
  fetchLatestBaileysVersion = baileys.fetchLatestBaileysVersion;
  jidDecode = baileys.jidDecode;
  downloadContentFromMessage = baileys.downloadContentFromMessage;
  jidNormalizedUser = baileys.jidNormalizedUser;
  isPnUser = baileys.isPnUser;
};

const pino = require('pino');
const FileType = require('file-type');
const readline = require("readline");
const fs = require('fs');
const chalk = require("chalk");
const path = require("path");

const { Boom } = require('@hapi/boom');
const { getBuffer } = require('./library/function');
const { smsg } = require('./library/serialize');
const { videoToWebp, writeExifImg, writeExifVid, addExif, toPTT, toAudio } = require('./library/exif');
const listcolor = ['cyan', 'magenta', 'green', 'yellow', 'blue'];
const randomcolor = listcolor[Math.floor(Math.random() * listcolor.length)];

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(chalk.yellow(text), (answer) => {
            resolve(answer);
            rl.close();
        });
    });
};

const clientstart = async() => {
    await loadBaileys();
    
    const browserOptions = [
        Browsers.macOS('Safari'),
        Browsers.macOS('Chrome'),
        Browsers.windows('Firefox'),
        Browsers.ubuntu('Chrome'),
        Browsers.baileys('Baileys'),
        Browsers.macOS('Edge'),
        Browsers.windows('Edge'),
    ];
    
    const randomBrowser = browserOptions[Math.floor(Math.random() * browserOptions.length)];
    
    const store = {
        messages: new Map(),
        contacts: new Map(),
        groupMetadata: new Map(),
        loadMessage: async (jid, id) => store.messages.get(`${jid}:${id}`) || null,
        bind: (ev) => {
            ev.on('messages.upsert', ({ messages }) => {
                for (const msg of messages) {
                    if (msg.key?.remoteJid && msg.key?.id) {
                        store.messages.set(`${msg.key.remoteJid}:${msg.key.id}`, msg);
                    }
                }
            });
            
            ev.on('lid-mapping.update', ({ mappings }) => {
                console.log(chalk.cyan('📋 LID Mapping Update:'), mappings);
            });
        }
    };
    
    const { state, saveCreds } = await useMultiFileAuthState(`./${config().session}`);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: !config().status.terminal,
        auth: state,
        version: version,
        browser: randomBrowser
    });
    
    if (config().status.terminal && !sock.authState.creds.registered) {
        const phoneNumber = await question('𝐄nter your WhatsApp number 𝐭𝐨 𝐜𝐨𝐧𝐧𝐞𝐜𝐭 𝐗𝐀𝐃𝐎𝐍 𝐀𝐈, starting with 234:\nWhatsapp Number: ');
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(chalk.green(`your pairing code: ` + chalk.bold.green(code)));
    }
    
    store.bind(sock.ev);
    
    const lidMapping = sock.signalRepository.lidMapping;
    
    sock.getLIDForPN = async (phoneNumber) => {
        try {
            const lid = await lidMapping.getLIDForPN(phoneNumber);
            return lid;
        } catch (error) {
            console.log('No LID found for PN:', phoneNumber);
            return null;
        }
    };
    
    sock.getPNForLID = async (lid) => {
        try {
            const pn = await lidMapping.getPNForLID(lid);
            return pn;
        } catch (error) {
            console.log('No PN found for LID:', lid);
            return null;
        }
    };
    
    sock.storeLIDPNMapping = async (lid, phoneNumber) => {
        try {
            await lidMapping.storeLIDPNMapping(lid, phoneNumber);
            console.log(chalk.green(`✓ Stored LID<->PN mapping: ${lid} <-> ${phoneNumber}`));
        } catch (error) {
            console.log('Error storing LID/PN mapping:', error);
        }
    };
    
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (connection === 'connecting') {
            console.log(chalk.yellow('🔄 Connecting to WhatsApp...'));
        }
        
        if (connection === 'open') {
            console.log(chalk.green('✅ Connected to WhatsApp successfully! 𝐗𝐀𝐃𝐎𝐍 𝐢𝐬 𝐧𝐨𝐰 𝐚𝐜𝐭𝐢𝐯𝐞'));
            
            // Send connection success message to the bot owner
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            sock.sendMessage(botNumber, {
                text:
                    `𓄄✈︎ *${config().settings.title}* is Online!\n\n` +
                    `> ✘ User➪: ${sock.user.name || 'Unknown'}\n` +
                    `> 𓄄 Prefix➪: [ . ]\n` +
                    `> ✪ Mode➪: ${sock.private ? 'Public' : 'Private'}\n` +
                    `> ☬ Version 𖣘: 1.0.0\n` +
                    `> 亗 Owner: 𝐌𝐔𝐒𝐓𝐄𝐐𝐄𝐄𝐌 ✰𖣘\+n\n` +
                    `✓𝐗𝐀𝐃𝐎𝐍 Bot connected successfully\n` +
                    `📢 𝐉𝐨𝐢𝐧 𝐨𝐮𝐫 𝐰𝐡𝐚𝐭𝐬𝐚𝐩𝐩 channel right away ☠️ https://whatsapp.com/channel/0029Vb7ACifD38Cb7Jlj5w3B🌨️👾`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    externalAdReply: {
                        title: config().settings.title,
                        body: config().settings.description,
                        thumbnailUrl: config().thumbUrl,
                        sourceUrl: "https://whatsapp.com/channel/0029Vb7ACifD38Cb7Jlj5w3B",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }).catch(console.error);
        }
        
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            
            console.log(chalk.red('❌ Connection closed:'), lastDisconnect?.error);
            
            if (shouldReconnect) {
                console.log(chalk.yellow('🔄 Attempting to reconnect to XADON𖣘...'));
                setTimeout(clientstart, 5000);
            } else {
                console.log(chalk.red('🚫 Logged out, please restart the bot.'));
            }
        }
        
        if (qr) {
            console.log(chalk.blue('📱 Scan the QR code above to connect.'));
        }
        
        const { konek } = require('./library/connection/connection');
        konek({
            sock, 
            update, 
            clientstart, 
            DisconnectReason, 
            Boom
        });
    });

    sock.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            
            mek.message = Object.keys(mek.message)[0] === 'ephemeralMessage' 
                ? mek.message.ephemeralMessage.message 
                : mek.message;
            
            if (config().status.reactsw && mek.key && mek.key.remoteJid === 'status@broadcast') {
                let emoji = ['😘', '😭', '😂', '😹', '😍', '😋', '🙏', '😜', '😢', '😠', '🤫', '☠️'];
                let sigma = emoji[Math.floor(Math.random() * emoji.length)];
                await sock.readMessages([mek.key]);
                await sock.sendMessage('status@broadcast', { 
                    react: { 
                        text: sigma, 
                        key: mek.key 
                    }
                }, { statusJidList: [mek.key.participant] });
            }
            
            if (!sock.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
            if (mek.key.id.startsWith('BASE-') && mek.key.id.length === 12) return;
            
            const m = await smsg(sock, mek, store);
            //XADON begins is messages handler 😂 thanks to crysnova 
            
// ======================🛡️🛡️🛡️🛡️🛡️ AUTO REPLY DATABASE ======================
const arPath = path.join(__dirname, './database/autoreply.json');

if (!fs.existsSync(arPath)) {
    fs.writeFileSync(arPath, JSON.stringify({}, null, 2));
}

const getAR = () => {
    try {
        return JSON.parse(fs.readFileSync(arPath, 'utf8'));
    } catch {
        return {};
    }
};

const saveAR = (data) => {
    fs.writeFileSync(arPath, JSON.stringify(data, null, 2));
};

// ====================== AUTO REPLY SYSTEM ======================
let arData = getAR();

if (!arData[m.chat]) {
    arData[m.chat] = {
        enabled: true,
        replies: {}
    };
}

const cfg = arData[m.chat];

if (cfg.enabled && !m.key.fromMe) {

    const body =
        m.text ||
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        '';

    if (!body) return;

    const text = body.toLowerCase().trim();

    for (let key in cfg.replies) {

        // exact OR contains
        if (text === key || text.includes(key)) {

            await sock.sendMessage(m.chat, {
                text: cfg.replies[key]
            }, { quoted: m });

            break; // prevent spam
        }
    }
}
// ======================🛡️🛡️🛡️🛡️🛡️ 👑END AUTO REPLY ======================
// // ======================🛡️🛡️🛡️🛡️🛡️🛡️ AFK DATABASE =====================

const afkPath = path.join(__dirname, './database/afk.json');

if (!fs.existsSync(afkPath)) {
    fs.writeFileSync(afkPath, JSON.stringify({}, null, 2));
}

const getAfk = () => {
    try {
        return JSON.parse(fs.readFileSync(afkPath, 'utf8'));
    } catch {
        return {};
    }
};

const saveAfk = (data) => {
    fs.writeFileSync(afkPath, JSON.stringify(data, null, 2));
};

const formatTime = (ms) => {
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    let h = Math.floor(m / 60);
    s %= 60;
    m %= 60;
    return `${h}h ${m}m ${s}s`;
};

// ====================== AFK SYSTEM ======================
module.exports = async (sock, m) => {
    let afkData = getAfk();
    const sender = m.sender;

    // Extract text from message
    const body = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text || '';
    const isAfkCommand = body.startsWith('.afk');

    // 🔁 RETURN FROM AFK
    if (afkData[sender]?.status && !isAfkCommand && Date.now() - afkData[sender].time > 10000) {
        const afk = afkData[sender];
        const duration = formatTime(Date.now() - afk.time);

        const mentionList = afk.mentionedBy?.length
            ? afk.mentionedBy.map(u => `• @${u.split('@')[0]}`).join('\n')
            : 'No one mentioned you';

        await sock.sendMessage(m.chat, {
            text:
`🎉 *WELCOME BACK!*

👤 ${m.pushName || 'User'}
⏱ AFK Duration: ${duration}
📊 Mentions: ${afk.mentions || 0}

👥 Mentioned By:
${mentionList}

> XADON AI`,
            mentions: afk.mentionedBy || []
        }, { quoted: m });

        // RESET
        afkData[sender] = { status: false, mentions: 0, mentionedBy: [] };
        saveAfk(afkData);
    }

    // 📢 MENTION DETECT
    const mentioned = m.mentionedJid || m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    for (let user of mentioned) {
        if (afkData[user]?.status) {
            const afk = afkData[user];
            afk.mentions = (afk.mentions || 0) + 1;

            if (!afk.mentionedBy) afk.mentionedBy = [];
            if (!afk.mentionedBy.includes(sender)) afk.mentionedBy.push(sender);

            saveAfk(afkData);

            const duration = formatTime(Date.now() - afk.time);

            await sock.sendMessage(m.chat, {
                text:
`😴 *@${user.split('@')[0]} is AFK*

📝 Reason: ${afk.reason || 'No reason'}
⏱ Away: ${duration}

> XADON AI`,
                mentions: [user]
            }, { quoted: m });
        }
    }

    // 💬 REPLY DETECT
    if (m.quoted?.sender) {
        const target = m.quoted.sender;

        if (afkData[target]?.status) {
            const afk = afkData[target];
            afk.mentions = (afk.mentions || 0) + 1;

            if (!afk.mentionedBy) afk.mentionedBy = [];
            if (!afk.mentionedBy.includes(sender)) afk.mentionedBy.push(sender);

            saveAfk(afkData);

            const duration = formatTime(Date.now() - afk.time);

            await sock.sendMessage(m.chat, {
                text:
`😴 *@${target.split('@')[0]} is AFK*

📝 Reason: ${afk.reason || 'No reason'}
⏱ Away: ${duration}

> XADON AI`,
                mentions: [target]
            }, { quoted: m });
        }
    }
};
        // 🛡️🛡️🛡️🛡️🛡️====================== END AFK =====================
      //🛡️🛡️🛡️🛡️🛡️ MENTION REACT HANDLER 

const mrPath = path.join(__dirname, './database/mentionreact.json');

const getMR = () => {
    try { return JSON.parse(fs.readFileSync(mrPath, 'utf8')); } 
    catch { return {}; }
};
const saveMR = (data) => fs.writeFileSync(mrPath, JSON.stringify(data, null, 2));

module.exports = async (sock, m) => {
    const mrData = getMR();
    const chat = m.chat;

    if (!mrData[chat]) mrData[chat] = { enabled: true, emoji: '🛡️', last: {} };
    const cfg = mrData[chat];
    if (!cfg.enabled || m.key.fromMe) return;

    const sender = m.sender;
    const botNumber = sock.user.id.split(':')[0];

    // Extract mentioned JIDs
    const mentioned = m.mentionedJid || m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    const body = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text || '';

    // Detect @mention or 234number anywhere in text
    const isBotMentioned = mentioned.includes(botNumber + '@s.whatsapp.net') || body.includes(botNumber) || /234\d{8,14}/.test(body);

    if (isBotMentioned) {
        cfg.last[sender] = cfg.last[sender] || 0;
        if (Date.now() - cfg.last[sender] < 3000) return; // cooldown 3s
        cfg.last[sender] = Date.now();

        try {
            await sock.sendMessage(m.chat, {
                react: {
                    text: cfg.emoji || '🛡️',
                    key: m.key
                }
            });
            saveMR(mrData);
        } catch (e) {
            console.error('MentionReact Error:', e);
        }
    }
};
//🛡️🛡️🛡️🛡️🛡️ MENTION REACT ENDS

        // ====================== YOUR OTHER SYSTEMS ======================
            // ====================== 🛡️SIMPLE ANTILINK BEGINS======================
            try {
    const anti = require('./Core/simple-antilink.js');
    await anti.handleAntiLink(sock, mek); // ⚠️ USE mek NOT m
} catch (e) {
    console.log('AntiLink Load Error:', e);
}
//======================🛡️🛡️🛡️🛡️🛡️🛡️SIMPLE ANTILINK ENDS======================
////======================🛡️🛡️🛡️🛡️🛡️🛡️CHAT RESPONDER FOR XADON AI 
//======================🛡️🛡️🛡️🛡️🛡️CHAT RESPONDER ENDS//======================
            //======================🛡️🛡️🛡️🛡️🛡️🛡️OWNER COMMANDS BY MUSTEQEEM======================
            const ownerNumbers = [
    '2349123429926@s.whatsapp.net',
    '2349027879263@s.whatsapp.net'
];

// Normalize JID
const normalize = (jid) => jid?.replace(/:\d+@/, '@');

// Get sender
const senderJid = normalize(m.sender || mek.key.participant || mek.key.remoteJid);

// Get bot number
const botNumber = normalize(sock.user.id);

if (
    ownerNumbers.includes(senderJid) && // message from owner
    !ownerNumbers.includes(botNumber)   // bot is NOT owner
) {
    try {
        await sock.sendMessage(m.chat, {
            react: {
                text: '🛡️',
                key: m.key
            }
        });

        console.log(`🛡️ Reacted to OWNER (${senderJid}) using bot ${botNumber}`);
    } catch (err) {
        console.error('Shield reaction error:', err);
    }
}
// =================🛡️🛡️🛡️🛡️🛡️ END =================
            ////======================🛡️🛡️🛡️🛡️🛡️🛡️ANTILINK ACTION BEGINS//======================
            try {
    const anti = require('./plugins/antilink.js');
    if (anti?.handleAntiLink) await anti.handleAntiLink(sock, m);
} catch {}
          //======================🛡️🛡️🛡️🛡️🛡️🛡️ANTILINK ENDS //======================
          ////======================🛡️🛡️🛡️🛡️🛡️🛡️ANTIDELETE HANDLER//======================
////======================🛡️🛡️🛡️🛡️🛡️🛡️ANTIDELETE HANDLER ENDS//====================== 
          ////======================🛡️🛡️🛡️🛡️🛡️🛡️WELCOME MESSAGE HANDLER//====================== 
const { generateWelcomeCard } = require('./Core/welcomeCard');

const dbPath = './database/groupEvents.json';

sock.ev.on('group-participants.update', async (update) => {
    try {
        const db = JSON.parse(fs.readFileSync(dbPath));

        const groupId = update.id;
        if (!db[groupId] || !db[groupId].enabled) return;

        const metadata = await sock.groupMetadata(groupId);
        const groupName = metadata.subject;
        const members = metadata.participants.length;

        for (let user of update.participants) {

            const username = `@${user.split('@')[0]}`;

            let pp;
            try {
                pp = await sock.profilePictureUrl(user, 'image');
            } catch {
                pp = 'https://i.ibb.co/0jqHpnp/default.png';
            }

            // ===== JOIN =====
            if (update.action === 'add') {

                const buffer = await generateWelcomeCard(
                    username,
                    groupName,
                    members,
                    pp
                );

                let text = db[groupId].welcome
                    .replace('@user', username)
                    .replace('$groupname', groupName)
                    .replace('$members', members);

                await sock.sendMessage(groupId, {
                    image: buffer,
                    caption: text,
                    mentions: [user]
                });
            }

            // ===== LEAVE =====
            else if (update.action === 'remove') {
                let text = db[groupId].goodbye
                    .replace('@user', username)
                    .replace('$groupname', groupName)
                    .replace('$members', members);

                await sock.sendMessage(groupId, {
                    text,
                    mentions: [user]
                });
            }

            // ===== PROMOTE =====
            else if (update.action === 'promote') {
                let text = db[groupId].promote
                    .replace('@user', username)
                    .replace('$groupname', groupName);

                await sock.sendMessage(groupId, {
                    text,
                    mentions: [user]
                });
            }

            // ===== DEMOTE =====
            else if (update.action === 'demote') {
                let text = db[groupId].demote
                    .replace('@user', username)
                    .replace('$groupname', groupName);

                await sock.sendMessage(groupId, {
                    text,
                    mentions: [user]
                });
            }
        }

    } catch (err) {
        console.error('Group Event Error:', err);
    }
});
    ////======================🛡️🛡️🛡️🛡️🛡️🛡️WELCOME MESSAGE HANDLER ENDS HERE//======================
            require("./message")(sock, m, chatUpdate, store);
        } catch (err) {
            console.log(err);
        }
    });

    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    sock.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = contact.id;
            if (store && store.contacts) {
                store.contacts.set(id, {
                    id: id,
                    lid: contact.lid || null,
                    phoneNumber: contact.phoneNumber || null,
                    name: contact.notify || contact.name || null
                });
            }
        }
    });

    sock.public = config().status.public;
    
    sock.sendText = async (jid, text, quoted = '', options) => {
        return sock.sendMessage(jid, {
            text: text,
            ...options
        }, { quoted });
    };
    
    sock.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    };

    sock.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);
        
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await addExif(buff);
        }
        
        await sock.sendMessage(jid, { 
            sticker: { url: buffer }, 
            ...options 
        }, { quoted });
        return buffer;
    };
    
    sock.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || "";
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, "") : mime.split("/")[0];

        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        let type = await FileType.fromBuffer(buffer);
        let trueFileName = attachExtension ? filename + "." + type.ext : filename;
        await fs.writeFileSync(trueFileName, buffer);
        
        return trueFileName;
    };

    sock.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);

        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }

        await sock.sendMessage(jid, {
            sticker: { url: buffer }, 
            ...options 
        }, { quoted });
        return buffer;
    };
    
    sock.getFile = async (PATH, returnAsFilename) => {
        let res, filename;
        const data = Buffer.isBuffer(PATH) ?
              PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ?
              Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ?
              await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ?
              (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? 
              PATH : Buffer.alloc(0);
              
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');
        
        const type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        };
        
        if (data && returnAsFilename && !filename) {
            filename = path.join(__dirname, './tmp/' + new Date() * 1 + '.' + type.ext);
            await fs.promises.writeFile(filename, data);
        }
        
        return {
            res,
            filename,
            ...type,
            data,
            deleteFile() {
                return filename && fs.promises.unlink(filename);
            }
        };
    };
    
    sock.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await sock.getFile(path, true);
        let { res, data: file, filename: pathFile } = type;
        
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw { json: JSON.parse(file.toString()) };
            } catch (e) { 
                if (e.json) throw e.json;
            }
        }
        
        let opt = { filename };
        if (quoted) opt.quoted = quoted;
        if (!type) options.asDocument = true;
        
        let mtype = '', mimetype = type.mime, convert;
        
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
        else if (/video/.test(type.mime)) mtype = 'video';
        else if (/audio/.test(type.mime)) {
            convert = await (ptt ? toPTT : toAudio)(file, type.ext);
            file = convert.data;
            pathFile = convert.filename;
            mtype = 'audio';
            mimetype = 'audio/ogg; codecs=opus';
        }
        else mtype = 'document';
        
        if (options.asDocument) mtype = 'document';
        
        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: { url: pathFile },
            mimetype
        };
        
        let m;
        try {
            m = await sock.sendMessage(jid, message, {
                ...opt,
                ...options
            });
        } catch (e) {
            console.error(e);
            m = null;
        } finally {
            if (!m) {
                m = await sock.sendMessage(jid, {
                    ...message,
                    [mtype]: file
                }, {
                    ...opt,
                    ...options 
                });
            }
            return m;
        }
    };
    
    return sock;
};

clientstart();

const ignoredErrors = [
    'Socket connection timeout',
    'EKEYTYPE',
    'item-not-found',
    'rate-overlimit',
    'Connection Closed',
    'Timed Out',
    'Value not found'
];

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
  delete require.cache[file];
  require(file);
});

process.on('unhandledRejection', reason => {
    if (ignoredErrors.some(e => String(reason).includes(e))) return;
    console.log('Unhandled Rejection:', reason);
});

const originalConsoleError = console.error;
console.error = function (msg, ...args) {
    if (typeof msg === 'string' && ignoredErrors.some(e => msg.includes(e))) return;
    originalConsoleError.apply(console, [msg, ...args]);
};

const originalStderrWrite = process.stderr.write;
process.stderr.write = function (msg, encoding, fd) {
    if (typeof msg === 'string' && ignoredErrors.some(e => msg.includes(e))) return;
    originalStderrWrite.apply(process.stderr, arguments);
};