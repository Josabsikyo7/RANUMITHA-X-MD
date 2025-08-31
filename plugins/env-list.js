const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');
const os = require("os");

// Helper to check boolean envs
function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "envsettings",
    alias: ["env", "config"],
    desc: "Show bot configuration options",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        if (!isOwner) return reply("❌ Only Owner can access env settings!");

        // Menu text
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

        // Send image + caption
        const menuMsg = await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        }, { quoted: mek });

        // Send voice note
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // Single-use reply listener
        const handler = async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const sender = msg.key.participant || msg.key.remoteJid;

            // Check if reply is to the menu message
            if (!msg.message.extendedTextMessage.contextInfo ||
                msg.message.extendedTextMessage.contextInfo.stanzaId !== menuMsg.key.id) return;

            // If not owner
            if (!isOwner(sender)) {
                await conn.sendMessage(from, { react: { text: "❌", key: msg.key } });
                await conn.sendMessage(from, { text: "❌ Only *Owner* can change settings!" }, { quoted: msg });
                return; // stop processing
            }

            // Owner selected an option
            const selectedOption = msg.message.extendedTextMessage.text.trim();
            switch (selectedOption) {
                case '1.1': reply("✅ Public Mode enabled"); break;
                case '1.2': reply("✅ Private Mode enabled"); break;
                case '1.3': reply("✅ Group Mode enabled"); break;
                case '1.4': reply("✅ Inbox Mode enabled"); break;
                case '2.1': reply("✅ Auto Voice ON"); break;
                case '2.2': reply("✅ Auto Voice OFF"); break;
                case '7.1': reply("🔄 Restarting Bot..."); break;
                case '7.2': reply("⏹️ Shutting down Bot..."); break;
                default: reply("❌ Invalid option, please select correctly.");
            }

            // Remove listener after first valid reply
            conn.ev.off('messages.upsert', handler);
        };

        conn.ev.on('messages.upsert', handler);

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error: ${error.message}`);
    }
});
