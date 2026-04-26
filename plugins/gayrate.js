module.exports = {
  command: 'x',
  alias: [],
  description: 'Xadon AI responder',
  category: 'fun',
  execute: async (sock, m, { reply }) => {
    const reactions = ['🌟', '🧭', '🚀', '⚡', '🔥', '🤖', '⚽', '✨', '💫'];
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    await sock.sendMessage(m.chat, { react: { text: reaction, key: m.key } });

    let msg = `XADON AI: ${reaction} Active and Listening💫\n*Executing Commands.......*\n`;
    msg += '[';
    for (let i = 0; i < 20; i++) {
      msg += '▒';
    }
    msg += '] 0%';
    const loadingMsg = await sock.sendMessage(m.chat, { text: msg }, { quoted: m });

    for (let i = 10; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let progress = '';
      for (let j = 0; j < i / 5; j++) {
        progress += '█';
      }
      for (let k = 0; k < 20 - (i / 5); k++) {
        progress += '▒';
      }
      msg = `XADON AI: ${reaction} Active and Listening💫\n*Executing Commands.......*\n`;
      msg += '[' + progress + '] ' + i + '%';
      await sock.sendMessage(m.chat, { text: msg, edit: loadingMsg.key });
    }

    await sock.sendMessage(m.chat, { text: `Wassup Boss <> 💫XADON AI✨` }, { quoted: m });
    await sock.sendMessage(m.chat, { text: 'Looking for My Master? <:> ✨Great Musteqeem ✨' }, { quoted: m });

    sock.ev.on('message', async (msg) => {
      if (msg.key.remoteJid === m.chat && msg.key.fromMe === false) {
        const text = msg.message.conversation;
        if (text.toLowerCase() === 'yes') {
          await sock.sendMessage(m.chat, { text: 'Bring ✨2349123429926✨' }, { quoted: msg });
        } else if (text.toLowerCase() === 'no') {
          await sock.sendMessage(m.chat, { text: 'Okay Boss' }, { quoted: msg });
        }
      }
    });
  }
};