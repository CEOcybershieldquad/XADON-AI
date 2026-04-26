module.exports = {
    command: 'deploy',
    alias: ['deployment', 'howtodeploy', 'setup'],
    description: 'Show beautiful XADON AI deployment guide',
    category: 'main',

    execute: async (sock, m, { reply }) => {

        const deployText = `✨ **✪ XADON AI • DEPLOYMENT DASHBOARD ✪** ✨

**Welcome to the Ultimate XADON AI Setup Guide**  
Deploy your powerful WhatsApp AI Bot in under 10 minutes! 🚀

---

### 🌐 **Step 1: Create Your Hosting Account**

1. Go to the **K0MRAID Host Dashboard**  
   👉 [https://dash.k0mraidhost.name.ng](https://dash.k0mraidhost.name.ng)

2. Click on **Register** (or Sign Up)  
3. Fill in your details (Email + Password)  
4. Verify your email if required

> Once logged in, you will see a clean dashboard with options to create servers.

---

### 🖥️ **Step 2: Create a Node.js Server**

1. After logging into the dashboard, click the **☰ 3 lines (menu)** at the top.

2. Select **Create New Server** or **New Application / Node.js Server**

3. Choose:
   - **Server Type**: Node.js  
   - **Version**: Latest (18 or 20 recommended)  
   - Give your server a name (e.g., \`XADON-AI-Bot\`)

4. Click **Create**  
   → Your server will be ready in seconds.

5. Open the newly created server.

---

### 🔑 **Step 3: Login to Typhoon Panel**

1. Go to the **Typhoon Panel**  
   👉 [https://typhoon.k0mraidhost.name.ng/auth/login](https://typhoon.k0mraidhost.name.ng/auth/login)

2. Use the same email and password from K0MRAID dashboard.

3. After login, you will see the control panel for files, console & bot management.

---

### 📥 **❌❌❌❌❌Step 4❌❌❌❌❌Still in development: Install XADON AI Bot**

1. In Typhoon Panel, go to **File Manager**

2. Delete default files if any (optional)

3. Open **Terminal / Console**

4. Run these commands one by one:

\`\`\`bash
git clone https://github.com/CEOcybershieldquad/XADON-AI.git .

npm install

npm start
\`\`\`

> Scan the QR code with your WhatsApp when prompted.

---

### 🎥 **Step 5✅: Full Video Tutorial**

Need visual help? Watch the complete step-by-step tutorial:

👉 **XADON AI Official Tutorial**  
https://t.me/xadonaibycybershieldsquad

---

### 📢 **Official Channel**

Stay updated with news, features & support:

👉 **XADON AI WhatsApp Channel**  
https://whatsapp.com/channel/0029Vb7ACifD38Cb7Jlj5w3B

---

### ✅ **Final Tips for Smooth Deployment**

• Use **Node.js v20** if available  
• Keep the console running (enable Keep Alive if available)  
• After scanning QR, the bot should go online automatically  
• Facing any error? Take screenshot and ask in the Telegram group

---

**Bot Successfully Deployed?**  
Just type \`.menu\` to see the full XADON AI menu! ✨

Need help at any step?  
Reply with the error or screenshot.

> Powered by **XADON AI** • Made with ❤️ by CyberShield Squad`;

        await reply(deployText);
    }
};