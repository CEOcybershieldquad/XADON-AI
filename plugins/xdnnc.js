module.exports = {
    command: "xdnnc",
    alias: ["nc", "numcheck"],
    category: "tools",

    execute: async (sock, m, { args, reply }) => {

        const jid = m.key.remoteJid;

        if (!args[0]) {
            return reply(`⚡ XADON NC

Usage:
.xdnnc check 234xxx
.xdnnc check @user
.xdnnc check (reply)

.xdnnc groups ...
.xdnnc msg ...
.xdnnc full ...`);
        }

        const sub = args[0].toLowerCase();

        // 🔥 SMART TARGET DETECTION (LIKE DEMOTE)
        let target;

        if (m.quoted) {
            target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
        } else if (args[1]) {
            target = args[1].replace(/\D/g, "") + "@s.whatsapp.net";
        }

        if (!target) return reply("❌ Reply, tag or enter number");

        try {

            await sock.sendMessage(jid, {
                react: { text: "🛰️", key: m.key }
            });

            const number = target.split("@")[0];

            // 🔍 CHECK
            if (sub === "check") {

                const [res] = await sock.onWhatsApp(target);

                if (!res?.exists) {
                    return reply(`❌ Not on WhatsApp`);
                }

                let name = "Unknown";
                let bio = "Hidden";

                try { name = await sock.getName(target); } catch {}
                try {
                    const status = await sock.fetchStatus(target);
                    bio = status?.status || "Hidden";
                } catch {}

                const menu = `
╔═══『 🔍 XADON NC CHECK 』═══╗
┃ 📱 ${number}
┃━━━━━━━━━━━━━━━━━━
┃ 👤 Name: ${name}
┃ 📝 Bio: ${bio}
┃ 🟢 Status: Private
╚══════════════════╝`;

                return sock.sendMessage(jid, { text: menu }, { quoted: m });
            }

            // 👥 GROUPS
            if (sub === "groups") {

                const groups = await sock.groupFetchAllParticipating();
                let shared = [];

                for (let id in groups) {
                    const participants = groups[id].participants || [];

                    if (participants.find(p => p.id === target)) {
                        shared.push(groups[id].subject);
                    }
                }

                const menu = `
╔═══『 👥 SHARED GROUPS 』═══╗
┃ 📱 ${number}
┃━━━━━━━━━━━━━━━━━━
┃ 🔢 ${shared.length} Groups
┃━━━━━━━━━━━━━━━━━━
${shared.slice(0,10).map(g => "• " + g).join("\n") || "None"}
╚══════════════════╝`;

                return sock.sendMessage(jid, { text: menu }, { quoted: m });
            }

            // 💬 MESSAGE
            if (sub === "msg") {

                const text = args.slice(1).join(" ").replace(number, "").trim();

                if (!text) return reply("❌ Provide message");

                await sock.sendMessage(target, { text });

                return reply(`✅ Sent to ${number}`);
            }

            // 🧠 FULL
            if (sub === "full") {

                const [res] = await sock.onWhatsApp(target);

                if (!res?.exists) {
                    return reply(`❌ Number not found`);
                }

                let name = "Unknown";
                let bio = "Hidden";

                try { name = await sock.getName(target); } catch {}
                try {
                    const status = await sock.fetchStatus(target);
                    bio = status?.status || "Hidden";
                } catch {}

                const groups = await sock.groupFetchAllParticipating();
                let count = 0;

                for (let id in groups) {
                    const participants = groups[id].participants || [];
                    if (participants.find(p => p.id === target)) count++;
                }

                const menu = `
╔═══『 🧠 XADON FULL SCAN 』═══╗
┃ 📱 ${number}
┃━━━━━━━━━━━━━━━━━━
┃ 👤 Name: ${name}
┃ 📝 Bio: ${bio}
┃ 👥 Groups: ${count}
┃ 🔐 Privacy: Enabled
╚══════════════════╝`;

                return sock.sendMessage(jid, { text: menu }, { quoted: m });
            }

            reply("❌ Invalid sub command");

        } catch (err) {
            console.log(err);
            reply("❌ XDNNc Error");
        }
    }
};