//const axios = require('axios');

module.exports = {
  command: 'wiki',
  alias: ['wikipedia', 'wikisearch'],
  description: 'Premium Wikipedia search with summary, image, link, and reactions',
  category: 'tools',
  owner: true, // owner-only

  execute: async (sock, m, { args, reply }) => {
    if (!args.length) return reply('⚠ Please provide a search term\nExample: .wiki dragons');

    try {
      const query = args.join(' ');

      // Step 1: Search page
      const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          format: 'json',
          srlimit: 1
        },
        headers: {
          'User-Agent': 'Musteqeem-MD/1.0'
        }
      });

      const result = searchRes.data.query.search[0];
      if (!result) return reply(`✘ No results found for "${query}"`);

      const pageTitle = result.title;

      // Step 2: Fetch summary
      const summaryRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`, {
        headers: {
          'User-Agent': 'XADON-AI/1.0'
        }
      });

      const data = summaryRes.data;
      const title = data.title || 'Unknown';
      const description = data.extract || 'No description available.';
      const pageUrl = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
      const imgUrl = data.originalimage?.source;

      // Author correction
      const author = data.displaytitle && data.displaytitle !== data.title ? data.displaytitle : 'Wikipedia';

      // Reaction emojis
      const reactEmojis = ['✅','📚','⚡','📝','🔍'];
      for (const emoji of reactEmojis) {
        await sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } }).catch(()=>{});
      }

      const caption = `
┏━━━━━━━━━━〔 🤖 WIKIPEDIA RESULT 🤖 〕━━━━━━━━┓
┃
┃  🏷️ Title  : ${title}
┃  📝 Summary: ${description}
┃  📎 Link   : ${pageUrl}
┃  🖋 Author : ${author}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
      `;

      if (imgUrl) {
        await sock.sendMessage(m.chat, {
          image: { url: imgUrl },
          caption,
          contextInfo: {
            externalAdReply: {
              title: "Musteqeem WIKI",
              body: author,
              mediaUrl: pageUrl,
              thumbnailUrl: imgUrl
            }
          }
        }, { quoted: m });
      } else {
        await reply(caption);
      }

    } catch (err) {
      console.error('Wiki plugin error:', err.message);
      reply('✘𓄄 Error fetching Wikipedia info');
    }
  }
};const axios = require('axios');

module.exports = {
  command: 'wiki',
  alias: ['wikipedia', 'wikisearch'],
  description: 'Premium Wikipedia search with summary, image, link, and reactions',
  category: 'tools',
  owner: true, // owner-only

  execute: async (sock, m, { args, reply }) => {
    if (!args.length) return reply('𓉤 Please provide a search term\nExample: .wiki dragons');

    try {
      const query = args.join(' ');

      // Step 1: Search page
      const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          format: 'json',
          srlimit: 1
        },
        headers: {
          'User-Agent': 'XADON-BOT/1.0'
        }
      });

      const result = searchRes.data.query.search[0];
      if (!result) return reply(`✘𓄄 No results found for "${query}"`);

      const pageTitle = result.title;

      // Step 2: Fetch summary
      const summaryRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`, {
        headers: { 'User-Agent': 'XADON-BOT/1.0' }
      });

      const data = summaryRes.data;
      const title = data.title || 'Unknown';
      const description = data.extract || 'No description available.';
      const pageUrl = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
      const imgUrl = data.originalimage?.source;

      // Always use Wikipedia as the author (publisher)
      const author = 'Wikipedia';

      // Reaction emojis for premium feel
      const reactEmojis = ['✅','📚','⚡','📝','🔍'];
      for (const emoji of reactEmojis) {
        await sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } }).catch(()=>{});
      }

      const caption = `
┏━━━━━━━━━━〔 🤖 WIKIPEDIA RESULT 🤖 〕━━━━━━━━┓
┃
┃  🏷️ Title  : ${title}
┃  📝 Summary: ${description}
┃  📎 Link   : ${pageUrl}
┃  🖋 Author : ${author}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
      `;

      if (imgUrl) {
        await sock.sendMessage(m.chat, {
          image: { url: imgUrl },
          caption,
          contextInfo: {
            externalAdReply: {
              title: "𝐌𝐔𝐒𝐓𝐄𝐐𝐄𝐄𝐌 WIKI",
              body: author,
              mediaUrl: pageUrl,
              thumbnailUrl: imgUrl
            }
          }
        }, { quoted: m });
      } else {
        await reply(caption);
      }

    } catch (err) {
      console.error('Wiki plugin error:', err.message);
      reply('✘😭 Error fetching Wikipedia info');
    }
  }
};
