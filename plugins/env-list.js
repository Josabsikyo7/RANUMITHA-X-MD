const config = require('../config');
const { cmd } = require('../command');

// Helper function to check boolean envs
function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["config", "settings", "setting"],
    desc: "Show bot configuration variables (Owner Reply Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        if (!isOwner) return reply("🚫 *Owner Only Command!*");

        // Menu text
        const envSettings = `╭─『 ⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 𝗠𝗘𝗡𝗨 ⚙️ 』───❏
├─ Name: RANUMITHA-X-MD
├─ Prefix: ${config.PREFIX}
├─ Owner: ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ
├─ Version: ${config.BOT_VERSION}
└─ Mode: ${config.MODE.toUpperCase()}

> Reply with numbers (e.g. 1.1 / 2.1) or type 'exit' to close.`;

        // Send menu image
        await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        });

        // Send menu audio
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4',
            ptt: true
        });

        // Menu actions mapping
        const menuActions = {
            "1.1": "✅ Public Mode enabled",
            "1.2": "✅ Private Mode enabled",
            "1.3": "✅ Group Mode enabled",
            "1.4": "✅ Inbox Mode enabled",
            "2.1": "✅ Auto Recording ON",
            "2.2": "❌ Auto Recording OFF",
            "3.1": "✅ Auto Typing ON",
            "3.2": "❌ Auto Typing OFF",
            "4.1": "✅ Always Online ON",
            "4.2": "❌ Always Online OFF",
            "5.1": "✅ Public Mod ON",
            "5.2": "❌ Public Mod OFF",
            "6.1": "✅ Auto Voice ON",
            "6.2": "❌ Auto Voice OFF",
            "7.1": "✅ Auto Sticker ON",
            "7.2": "❌ Auto Sticker OFF",
            "8.1": "✅ Auto Reply ON",
            "8.2": "❌ Auto Reply OFF",
            "9.1": "✅ Auto React ON",
            "9.2": "❌ Auto React OFF",
            "10.1": "✅ Auto Status Seen ON",
            "10.2": "❌ Auto Status Seen OFF",
            "11.1": "✅ Auto Status Reply ON",
            "11.2": "❌ Auto Status Reply OFF",
            "12.1": "✅ Auto Status React ON",
            "12.2": "❌ Auto Status React OFF",
            "13.1": "✅ Custom React ON",
            "13.2": "❌ Custom React OFF",
            "14.1": "✅ Anti VV ON",
            "14.2": "❌ Anti VV OFF",
            "15.1": "✅ Welcome ON",
            "15.2": "❌ Welcome OFF",
            "16.1": "✅ Admin Events ON",
            "16.2": "❌ Admin Events OFF",
            "17.1": "✅ Anti Link ON",
            "17.2": "❌ Anti Link OFF",
            "18.1": "✅ Read Message ON",
            "18.2": "❌ Read Message OFF",
            "19.1": "✅ Anti Bad ON",
            "19.2": "❌ Anti Bad OFF",
            "20.1": "✅ Anti Link Kick ON",
            "20.2": "❌ Anti Link Kick OFF",
            "21.1": "✅ Read CMD ON",
            "21.2": "❌ Read CMD OFF"
        };

        // Number reply handler
        const handler = async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages[0];
                if (!msg.message) return;

                const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
                if (!text) return;

                // exit works for everyone
                if (text === "exit") {
                    await reply("✅ Settings menu closed.");
                    conn.ev.off('messages.upsert', handler);
                    return;
                }

                // Only owner can trigger number replies
                if (!isOwner) return;

                // Strict number validation regex
                if (/^(1\.1|1\.2|1\.3|1\.4|2\.1|2\.2|3\.1|3\.2|4\.1|4\.2|5\.1|5\.2|6\.1|6\.2|7\.1|7\.2|8\.1|8\.2|9\.1|9\.2|10\.1|10\.2|11\.1|11\.2|12\.1|12\.2|13\.1|13\.2|14\.1|14\.2|15\.1|15\.2|16\.1|16\.2|17\.1|17\.2|18\.1|18\.2|19\.1|19\.2|20\.1|20\.2|21\.1|21\.2)$/.test(text)) {
                    // React to the message
                    await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
                    // Reply message tagged/quoted
                    await conn.sendMessage(from, { text: menuActions[text], quoted: msg });
                } else if (/^\d{1,2}\.\d$/.test(text)) {
                    await reply("❌ Invalid option, please select correctly.");
                }

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
