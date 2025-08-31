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
    pattern: "env",
    alias: ["config", "settings", "setting"],
    desc: "Show bot configuration options",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        // 🛡️ Only Owner
        if (!isOwner) {
            return reply("❌ Only the *Owner* can access this command!");
        }

        // menu text
        let menu = `
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

        // 🖼️ send image with menu text
        vv = await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },  // put your env menu image path here
            caption: menu
        }, { quoted: mek });

        // 🎤 send voice note
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },  // put your env voice path here
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // listen for replies
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            // reply check only if response is to env menu
            if (msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                
                // 🛡️ safety check again
                if (!isOwner) return;

                try {
                    switch (selectedOption) {
                        case '1.1':
                            reply(".update MODE:public");
                            reply("✅ Public Mode enabled");
                            break;
                        case '1.2':
                            reply(".update MODE:private");
                            reply("✅ Private Mode enabled");
                            break;
                        case '1.3':
                            reply(".update MODE:group");
                            reply("✅ Group Mode enabled");
                            break;
                        case '1.4':
                            reply(".update MODE:inbox");
                            reply("✅ Inbox Mode enabled");
                            break;
                        case '2.1':
                            reply(".update AUTO_VOICE:true");
                            reply(".restart");
                            break;
                        case '2.2':
                            reply(".update AUTO_VOICE:false");
                            reply(".restart");
                            break;
                        case '7.1':
                            reply(".restart");
                            break;
                        case '7.2':
                            reply(".shutdown");
                            break;
                        default:
                            reply("❌ Invalid option, please select correctly.");
                    }
                } catch (error) {
                    console.error('Env command error:', error);
                    reply(`❌ Error processing option: ${error.message}`);
                }
            }
        });

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error displaying config: ${error.message}`);
    }
});
