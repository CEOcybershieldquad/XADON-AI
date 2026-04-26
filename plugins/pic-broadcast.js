const { createCanvas, loadImage } = require('canvas');

module.exports = {
  command: 'pic-broadcast',
  alias: ['pbc'],
  description: 'Broadcast a message to all groups in picture',
  category: 'owner',
  execute: async (sock, m, { args, reply }) => {
    try {
      if (args.length === 0) return reply('Enter a message to broadcast');

      const message = args.join(' ');
      const groups = await sock.groupFetchAllParticipating();
      const broadcastResults = [];
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const senderName = m.pushName || 'Unknown';
      const senderNumber = m.sender.split('@')[0];
      const currentTime = new Date().toLocaleTimeString();
      
      // Put your background image path here
      const backgroundImage = await loadImage('https://i.ibb.co/9Hr0xBjK/temp-media-1772371826319.jpg'); 

      for (const id in groups) {
        try {
          await delay(2000); // 2-second delay
          const groupMetadata = await sock.groupMetadata(id);
          const participants = groupMetadata.participants.map(p => p.id);

          const canvas = createCanvas(800, 600);
          const ctx = canvas.getContext('2d');

          // Draw background
          ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

          // Draw title
          ctx.font = '48px Arial';
          ctx.fillStyle = '#ffd700'; // gold color
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText('XADON BROADCAST System', canvas.width / 2, 20);

          // Draw sender info
          ctx.font = '24px Arial';
          ctx.fillStyle = '#ffffff'; // white color
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(`Owner: ${senderName} (${senderNumber})`, canvas.width / 2, 70);

          // Draw time
          ctx.font = '24px Arial';
          ctx.fillStyle = '#ffffff'; // white color
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(`Time: ${currentTime}`, canvas.width / 2, 110);

          // Draw message
          ctx.font = 'bold 36px serif';
          ctx.fillStyle = '#ff0000'; // dark red color
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(message, canvas.width / 2, canvas.height / 2);

          const buffer = canvas.toBuffer('image/png');

          await sock.sendMessage(id, {
            image: buffer,
            caption: `Broadcast Message`,
            mentions: participants
          });

          broadcastResults.push(`✅ Message sent to ${groupMetadata.subject}`);
        } catch (error) {
          broadcastResults.push(`❌ Error sending to ${id}: ${error.message}`);
        }
      }

      reply(`Broadcast results:\n${broadcastResults.join('\n')}`);
    } catch (error) {
      console.error('Broadcast command error:', error);
      reply(`Error: ${error.message}`);
    }
  }
};