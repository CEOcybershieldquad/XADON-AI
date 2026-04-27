const { createCanvas, loadImage } = require('canvas');

async function generateWelcomeCard(username, groupName, memberCount, profilePic) {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Background
    const bg = await loadImage('https://i.ibb.co/2kR5zqX/bg.jpg');
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Profile circle
    const avatar = await loadImage(profilePic);
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 200, 80, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 70, 120, 160, 160);
    ctx.restore();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Sans';
    ctx.fillText('WELCOME', 300, 100);

    ctx.font = '24px Sans';
    ctx.fillText(username, 300, 160);

    ctx.font = '20px Sans';
    ctx.fillText(`Group: ${groupName}`, 300, 210);
    ctx.fillText(`Members: ${memberCount}`, 300, 250);

    return canvas.toBuffer();
}

module.exports = { generateWelcomeCard };