const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "envsettings",
    alias: ["env", "config"],
    desc: "Show bot configuration options",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        // Non-owner trying to open menu
        if (!isOwner) {
            await conn.sendMessage(from, { react: { text: "❌", key: m?.key || {} } });
            return reply("❌ Only Owner can access env settings!", { quoted: m || undefined });
        }

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

        // Send menu image
        await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        }, { quoted: m || undefined });

        // Send menu voice
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m || undefined });

        // Listen to all new messages
        const handler = async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message) return;

            // Get text message
            let text = "";
            if (msg.message.extendedTextMessage) {
                text = msg.message.extendedTextMessage.text.trim();
            } else if (msg.message.conversation) {
                text = msg.message.conversation.trim();
            } else return;

            // Non-owner sends any number
            if (!isOwner) {
                const numbers = ["1.1","1.2","1.3","1.4","2.1","2.2","7.1","7.2"];
                if (numbers.includes(text)) {
                    await conn.sendMessage(from, { react: { text: "❌", key: msg.key || {} } });
                    await conn.sendMessage(from, { text: "❌ Owner nemei!", quoted: msg });
                }
                return;
            }

            // Owner sends a number
            switch (text) {
                case '1.1': await reply("✅ Public Mode enabled"); break;
                case '1.2': await reply("✅ Private Mode enabled"); break;
                case '1.3': await reply("✅ Group Mode enabled"); break;
                case '1.4': await reply("✅ Inbox Mode enabled"); break;
                case '2.1': await reply("✅ Auto Voice ON"); break;
                case '2.2': await reply("✅ Auto Voice OFF"); break;
                case '7.1': await reply("🔄 Restarting Bot..."); break;
                case '7.2': await reply("⏹️ Shutting down Bot..."); break;
                default:
                    // React ❌ if owner typed invalid number
                    if (text.match(/^\d\.\d$/)) { // matches number like 1.1
                        await conn.sendMessage(from, { react: { text: "❌", key: msg.key || {} } });
                        await reply("❌ Invalid option, please select correctly.");
                    }
            }
        };

        conn.ev.on('messages.upsert', handler);

    } catch (error) {
        console.error('Env command error:', error);
        await conn.sendMessage(from, { react: { text: "❌", key: m?.key || {} } });
        reply(`❌ Error: ${error.message}`, { quoted: m || undefined });
    }
});
