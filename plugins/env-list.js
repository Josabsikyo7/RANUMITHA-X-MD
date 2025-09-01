const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "env",
    alias: ["config", "settings", "setting"],
    desc: "Show bot configuration variables (Owner Reply Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        const envSettings = `╭─『 ⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 𝗠𝗘𝗡𝗨 ⚙️ 』───❏
├─ Name: RANUMITHA-X-MD
├─ Prefix: ${config.PREFIX}
├─ Owner: ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ
├─ Version: ${config.BOT_VERSION}
└─ Mode: ${config.MODE.toUpperCase()}

> Reply with numbers (e.g. 1.1 / 2.1).`;

        // Send menu image
        await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        }, { quoted: mek });

        // Send menu audio
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // Number reply handler
        const handler = async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages[0];
                if (!msg.message) return;

                let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
                if (!text) return;

                text = text.trim();

                // Owner check
                if (!isOwner) {
                    await conn.sendMessage(from, { react: { text: "❌", key: msg.key } });
                    await conn.sendMessage(from, { text: "🚫 Only Owner Can Use This Command!", quoted: msg });
                    return;
                }

                // ✅ Owner: react ✅
                await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });

                // Map number to reply
                const menuReplies = {
                    '1.1': "Public Mode enabled",
                    '1.2': "Private Mode enabled",
                    '1.3': "Group Mode enabled",
                    '1.4': "Inbox Mode enabled",
                    '2.1': "Auto Recording ON",
                    '2.2': "Auto Recording OFF",
                    '3.1': "Auto Typing ON",
                    '3.2': "Auto Typing OFF",
                    '4.1': "Always Online ON",
                    '4.2': "Always Online OFF",
                    '5.1': "Public Mod ON",
                    '5.2': "Public Mod OFF",
                    '6.1': "Auto Voice ON",
                    '6.2': "Auto Voice OFF",
                    '7.1': "Auto Sticker ON",
                    '7.2': "Auto Sticker OFF",
                    '8.1': "Auto Reply ON",
                    '8.2': "Auto Reply OFF",
                    '9.1': "Auto React ON",
                    '9.2': "Auto React OFF",
                    '10.1': "Auto Status Seen ON",
                    '10.2': "Auto Status Seen OFF",
                    '11.1': "Auto Status Reply ON",
                    '11.2': "Auto Status Reply OFF",
                    '12.1': "Auto Status React ON",
                    '12.2': "Auto Status React OFF",
                    '13.1': "Custom React ON",
                    '13.2': "Custom React OFF",
                    '14.1': "Anti VV ON",
                    '14.2': "Anti VV OFF",
                    '15.1': "Welcome ON",
                    '15.2': "Welcome OFF",
                    '16.1': "Admin Events ON",
                    '16.2': "Admin Events OFF",
                    '17.1': "Anti Link ON",
                    '17.2': "Anti Link OFF",
                    '18.1': "Read Message ON",
                    '18.2': "Read Message OFF",
                    '19.1': "Anti Bad ON",
                    '19.2': "Anti Bad OFF",
                    '20.1': "Anti Link Kick ON",
                    '20.2': "Anti Link Kick OFF",
                    '21.1': "Read CMD ON",
                    '21.2': "Read CMD OFF"
                };

                const replyText = menuReplies[text] ? `✅ ${menuReplies[text]} (${text})` : `❌ Invalid option (${text})`;

                // Reply quoting the original number message
                await conn.sendMessage(from, { text: replyText, quoted: msg });

            } catch (err) {
                console.error("Handler error:", err);
            }
        };

        conn.ev.on('messages.upsert', handler);

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error: ${error.message}`);
    }
});
