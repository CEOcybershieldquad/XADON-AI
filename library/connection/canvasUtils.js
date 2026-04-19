import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import config from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, '..', 'assets');
const fontsPath = path.join(assetsPath, 'fonts');
const cachePath = path.join(process.cwd(), 'cache', 'fonts');
const imagesPath = path.join(assetsPath, 'images');

async function downloadGoogleFont(fontName, outputPath) {
    try {
        const apiKey = process.env.GOOGLE_FONTS_API_KEY || '';
        const fontNameUrl = fontName.replace(/\s+/g, '+');
        
        const cssUrl = `https://fonts.googleapis.com/css2?family=${fontNameUrl}:wght@400;700&display=swap`;
        const cssResponse = await axios.get(cssUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        const fontUrlMatch = cssResponse.data.match(/url\((https:\/\/fonts\.gstatic\.com\/[^\)]+)\)/);
        if (!fontUrlMatch) {
            throw new Error(`Font URL not found for ${fontName}`);
        }
        
        const fontUrl = fontUrlMatch[1];
        const fontResponse = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, fontResponse.data);
        
        console.log(`Downloaded Google Font: ${fontName}`);
        return true;
    } catch (error) {
        console.warn(`Failed to download Google Font ${fontName}:`, error.message);
        return false;
    }
}

async function loadFonts() {
    try {
        await fs.ensureDir(fontsPath);
        await fs.ensureDir(cachePath);
        
        const primaryFont = path.join(fontsPath, 'primary.ttf');
        const secondaryFont = path.join(fontsPath, 'secondary.ttf');
        
        if (fs.existsSync(primaryFont)) {
            GlobalFonts.registerFromPath(primaryFont, 'Primary');
            console.log('Loaded local primary font');
        } else {
            const cachedPrimary = path.join(cachePath, 'primary.ttf');
            if (fs.existsSync(cachedPrimary)) {
                GlobalFonts.registerFromPath(cachedPrimary, 'Primary');
                console.log('Loaded cached primary font');
            } else {
                const downloaded = await downloadGoogleFont('Poppins', cachedPrimary);
                if (downloaded) {
                    GlobalFonts.registerFromPath(cachedPrimary, 'Primary');
                }
            }
        }
        
        if (fs.existsSync(secondaryFont)) {
            GlobalFonts.registerFromPath(secondaryFont, 'Secondary');
            console.log('Loaded local secondary font');
        } else {
            const cachedSecondary = path.join(cachePath, 'secondary.ttf');
            if (fs.existsSync(cachedSecondary)) {
                GlobalFonts.registerFromPath(cachedSecondary, 'Secondary');
                console.log('Loaded cached secondary font');
            } else {
                const downloaded = await downloadGoogleFont('Roboto', cachedSecondary);
                if (downloaded) {
                    GlobalFonts.registerFromPath(cachedSecondary, 'Secondary');
                }
            }
        }
    } catch (error) {
        console.warn('Custom fonts not loaded, using default fonts:', error.message);
    }
}

await loadFonts();

export async function createWelcomeImage(username, groupName, memberCount, profilePicUrl) {
    const canvas = createCanvas(1200, 600);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
        const profilePic = await loadImage(profilePicUrl).catch(() => null);
        if (profilePic) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(600, 200, 120, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(profilePic, 480, 80, 240, 240);
            ctx.restore();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.arc(600, 200, 120, 0, Math.PI * 2);
            ctx.stroke();
        }
    } catch (error) {
        console.error('Error loading profile picture:', error);
    }

    ctx.font = 'bold 70px Primary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText('WELCOME!', 600, 380);

    ctx.font = 'bold 50px Primary, Arial';
    ctx.fillStyle = '#ffd700';
    const truncatedName = username.length > 20 ? username.substring(0, 17) + '...' : username;
    ctx.fillText(truncatedName, 600, 450);

    ctx.font = '30px Secondary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`to ${groupName}`, 600, 490);

    ctx.font = '25px Secondary, Arial';
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText(`Member #${memberCount}`, 600, 540);

    return canvas.toBuffer('image/png');
}

export async function createGoodbyeImage(username, groupName) {
    const canvas = createCanvas(1200, 600);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ee0979');
    gradient.addColorStop(0.5, '#ff6a00');
    gradient.addColorStop(1, '#d66d75');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 80px Primary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText('GOODBYE!', 600, 250);

    ctx.font = 'bold 50px Primary, Arial';
    ctx.fillStyle = '#ffd700';
    const truncatedName = username.length > 20 ? username.substring(0, 17) + '...' : username;
    ctx.fillText(truncatedName, 600, 330);

    ctx.font = '35px Secondary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('has left the group', 600, 390);

    ctx.font = '30px Secondary, Arial';
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText(`We'll miss you!`, 600, 480);

    ctx.font = '25px Secondary, Arial';
    ctx.fillText(`${groupName}`, 600, 530);

    return canvas.toBuffer('image/png');
}

export async function createPromoteImage(username, groupName, promotedBy) {
    const canvas = createCanvas(1200, 600);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f7971e');
    gradient.addColorStop(0.5, '#ffd200');
    gradient.addColorStop(1, '#ffed4e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 90px Primary, Arial';
    ctx.fillStyle = '#1a1a1a';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText('👑 PROMOTED! 👑', 600, 180);

    ctx.font = 'bold 55px Primary, Arial';
    ctx.fillStyle = '#2d3436';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.shadowBlur = 10;
    const truncatedName = username.length > 20 ? username.substring(0, 17) + '...' : username;
    ctx.fillText(truncatedName, 600, 280);

    ctx.font = '35px Secondary, Arial';
    ctx.fillStyle = '#1a1a1a';
    ctx.shadowBlur = 5;
    ctx.fillText('is now a Group Admin', 600, 340);

    ctx.font = '28px Secondary, Arial';
    ctx.fillStyle = '#2d3436';
    ctx.fillText(`Promoted by: ${promotedBy}`, 600, 420);

    ctx.font = '25px Secondary, Arial';
    ctx.fillText(`${groupName}`, 600, 500);

    return canvas.toBuffer('image/png');
}

export async function createDemoteImage(username, groupName, demotedBy) {
    const canvas = createCanvas(1200, 600);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#bdc3c7');
    gradient.addColorStop(0.5, '#95a5a6');
    gradient.addColorStop(1, '#7f8c8d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 80px Primary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText('DEMOTED', 600, 200);

    ctx.font = 'bold 50px Primary, Arial';
    ctx.fillStyle = '#ecf0f1';
    const truncatedName = username.length > 20 ? username.substring(0, 17) + '...' : username;
    ctx.fillText(truncatedName, 600, 280);

    ctx.font = '35px Secondary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('is no longer an admin', 600, 340);

    ctx.font = '28px Secondary, Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText(`Demoted by: ${demotedBy}`, 600, 420);

    ctx.font = '25px Secondary, Arial';
    ctx.fillText(`${groupName}`, 600, 500);

    return canvas.toBuffer('image/png');
}

export async function createLevelUpImage(username, level, xp, nextLevelXp) {
    const canvas = createCanvas(1200, 600);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#00c9ff');
    gradient.addColorStop(0.5, '#92fe9d');
    gradient.addColorStop(1, '#00f2fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 90px Primary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText('🎉 LEVEL UP! 🎉', 600, 180);

    ctx.font = 'bold 55px Primary, Arial';
    ctx.fillStyle = '#ffd700';
    const truncatedName = username.length > 20 ? username.substring(0, 17) + '...' : username;
    ctx.fillText(truncatedName, 600, 270);

    ctx.font = 'bold 80px Primary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Level ${level}`, 600, 370);

    ctx.font = '30px Secondary, Arial';
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText(`${xp} / ${nextLevelXp} XP`, 600, 430);

    const barWidth = 800;
    const barHeight = 40;
    const barX = 200;
    const barY = 460;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    const progress = Math.min((xp / nextLevelXp) * barWidth, barWidth);
    const progressGradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    progressGradient.addColorStop(0, '#f7971e');
    progressGradient.addColorStop(1, '#ffd200');
    ctx.fillStyle = progressGradient;
    ctx.fillRect(barX, barY, progress, barHeight);

    return canvas.toBuffer('image/png');
}

export async function createGroupUpdateImage(updateType, oldValue, newValue, changedBy) {
    const canvas = createCanvas(1200, 600);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#16a085');
    gradient.addColorStop(0.5, '#1abc9c');
    gradient.addColorStop(1, '#2ecc71');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 70px Primary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText('📝 GROUP UPDATED', 600, 150);

    ctx.font = 'bold 40px Primary, Arial';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(updateType.toUpperCase(), 600, 230);

    ctx.font = '30px Secondary, Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('From:', 600, 300);
    
    ctx.font = 'bold 35px Secondary, Arial';
    ctx.fillStyle = '#ffffff';
    const truncatedOld = oldValue.length > 30 ? oldValue.substring(0, 27) + '...' : oldValue;
    ctx.fillText(truncatedOld, 600, 350);

    ctx.font = '30px Secondary, Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('To:', 600, 410);
    
    ctx.font = 'bold 35px Secondary, Arial';
    ctx.fillStyle = '#ffffff';
    const truncatedNew = newValue.length > 30 ? newValue.substring(0, 27) + '...' : newValue;
    ctx.fillText(truncatedNew, 600, 460);

    ctx.font = '25px Secondary, Arial';
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText(`Changed by: ${changedBy}`, 600, 530);

    return canvas.toBuffer('image/png');
}

export async function createAnnouncementImage(title, message, author) {
    const canvas = createCanvas(1200, 600);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#8e2de2');
    gradient.addColorStop(0.5, '#4a00e0');
    gradient.addColorStop(1, '#7f00ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 80px Primary, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText('📢 ANNOUNCEMENT', 600, 120);

    ctx.font = 'bold 50px Primary, Arial';
    ctx.fillStyle = '#ffd700';
    const truncatedTitle = title.length > 25 ? title.substring(0, 22) + '...' : title;
    ctx.fillText(truncatedTitle, 600, 220);

    ctx.font = '35px Secondary, Arial';
    ctx.fillStyle = '#ffffff';
    
    const words = message.split(' ');
    let line = '';
    let y = 300;
    const maxWidth = 1000;
    
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, 600, y);
            line = words[i] + ' ';
            y += 45;
            if (y > 450) break;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, 600, y);

    ctx.font = '28px Secondary, Arial';
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText(`- ${author}`, 600, 530);

    return canvas.toBuffer('image/png');
}

module.exports = {
    createWelcomeImage,
    createGoodbyeImage,
    createPromoteImage,
    createDemoteImage,
    createLevelUpImage,
    createGroupUpdateImage,
    createAnnouncementImage
};
