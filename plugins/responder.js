module.exports = {
  command: 'xadon!',
  alias: [],
  description: 'Xadon AI responder',
  category: 'fun',
  execute: async (sock, m, { reply }) => {
    const reactions = ['🌟', '🧭', '🚀', '⚡', '🔥', '🤖', '⚽', '✨', '💫'];
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    await sock.sendMessage(m.chat, { react: { text: reaction, key: m.key } });

    let msg = `XADON AI: ${reaction} Active and Listening💫\n*Executing Commands.......*\n`;
    msg += '▰▱▱▱▱▱▱▱▱▱ 0%\n';
    const loadingMsg = await sock.sendMessage(m.chat, { text: msg }, { quoted: m });

    for (let i = 10; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      msg = `XADON AI: ${reaction} Active and Listening💫\n*Executing Commands.......*\n`;
      msg += '▰'.repeat(i / 10) + '▱'.repeat(10 - i / 10) + ` ${i}%\n`;
      await sock.sendMessage(m.chat, { text: msg, edit: loadingMsg.key });
    }

    await sock.sendMessage(m.chat, { text: `Wassup Boss > 💫XADON AI✨` }, { quoted: m });
  }
};