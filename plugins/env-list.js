const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const os = require("os");

cmd({
    pattern: "envsettings",
    alias: ["env", "config"],
    desc: "Show bot configuration options",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        // Only owner can open menu
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

        // Send menu image
        const menuMsg = await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        }, { quoted: mek });

        // Send menu voice
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // Single-use reply listener
        const handler = async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const replySender = msg.key.participant || msg.key.remoteJid;

            // Check if reply is to the menu
            const context = msg.message.extendedTextMessage.contextInfo;
            if (!context?.stanzaId || context.stanzaId !== menuMsg.key.id) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            // Non-owner trying to select a number
            if (!isOwner) {
                await conn.sendMessage(from, { react: { text: "❌", key: msg.key } });
                await conn.sendMessage(from, { text: "❌ Owner nemei!" }, { quoted: msg });
                return;
            }

            // Owner: first react ✅
            await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });

            // Then send the confirmation message
            switch (selectedOption) {
                case '1.1': await reply("✅ Public Mode enabled"); break;
                case '1.2': await reply("✅ Private Mode enabled"); break;
                case '1.3': await reply("✅ Group Mode enabled"); break;
                case '1.4': await reply("✅ Inbox Mode enabled"); break;
                case '2.1': await reply("✅ Auto Voice ON"); break;
                case '2.2': await reply("✅ Auto Voice OFF"); break;
                case '7.1': await reply("🔄 Restarting Bot..."); break;
                case '7.2': await reply("⏹️ Shutting down Bot..."); break;
                default: await reply("❌ Invalid option, please select correctly.");
            }

            // Remove listener after processing
            conn.ev.off('messages.upsert', handler);
        };

        conn.ev.on('messages.upsert', handler);

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error: ${error.message}`);
    }
});
