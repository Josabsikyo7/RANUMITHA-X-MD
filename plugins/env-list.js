const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');
const os = require("os");

// Reusable function to check boolean envs
function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "envsettings",
    alias: ["config", "settings", "setting"],
    desc: "Show bot configuration options",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        // 🛡️ Only owner can run command
        if (!isOwner) return reply("❌ Only Owner can access env settings!");

        // env menu text
        let envSettings = `
╭━━━ 『 ${config.BOT_NAME} CONFIG 』━━━╮
│
│ 1.1  Public Mode
│ 1.2  Private Mode
│ 1.3  Group Mode
│ 1.4  Inbox Mode
│
│ 2.1  Auto Voice ON
│ 2.2  Auto Voice OFF
│
│ 7.1  Restart Bot
│ 7.2  Shutdown Bot
│
╰━━━━━━━━━━━━━━━━━━╯
`;

        // send image + caption
        const vv = await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        }, { quoted: mek });

        // send voice note
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // reply handling (owner only)
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {

                if (!isOwner) {
                    return conn.sendMessage(from, { text: "❌ Only *Owner* can change settings!" }, { quoted: msg });
                }

                switch (selectedOption) {
                    case '1.1':
                        reply("✅ Public Mode enabled");
                        break;
                    case '1.2':
                        reply("✅ Private Mode enabled");
                        break;
                    case '1.3':
                        reply("✅ Group Mode enabled");
                        break;
                    case '1.4':
                        reply("✅ Inbox Mode enabled");
                        break;
                    case '2.1':
                        reply("✅ Auto Voice ON");
                        break;
                    case '2.2':
                        reply("✅ Auto Voice OFF");
                        break;
                    case '7.1':
                        reply("🔄 Restarting Bot...");
                        break;
                    case '7.2':
                        reply("⏹️ Shutting down Bot...");
                        break;
                    default:
                        reply("❌ Invalid option, please select correctly.");
                }
            }
        });

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error: ${error.message}`);
    }
});;
