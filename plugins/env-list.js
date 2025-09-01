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
        // --- Owner Check before showing menu ---
        if (!isOwner) {
            return reply("🚫 *Owner Only Command!*");
        }

        // Menu text
        let envSettings = `╭─『 ⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 𝗠𝗘𝗡𝗨 ⚙️ 』───❏
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
        }, { quoted: mek });

        // Send menu audio
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

        // --- Number reply handler ---
        const handler = async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages[0];
                if (!msg.message) return;

                // Support conversation + extendedTextMessage
                let text = msg.message.conversation
                        || msg.message.extendedTextMessage?.text;
                if (!text) return;

                text = text.trim();

                // --- Owner Only Check for number replies ---
                if (!isOwner) {
                    return reply("🚫 *Owner Only Command!*");
                }

                // ✅ Valid number regex for only specific options
                if (/^(1\.1|1\.2|1\.3|1\.4|2\.1|2\.2|3\.1|3\.2)$/.test(text)) {
                    // react ✅
                    await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
                }

                // --- Handle menu numbers ---
                switch (text) {
                    case '1.1': await conn.sendMessage(from, { text: "✅ Public Mode enabled", quoted: msg }); break;
                    case '1.2': await conn.sendMessage(from, { text: "✅ Private Mode enabled", quoted: msg }); break;
                    case '1.3': await conn.sendMessage(from, { text: "✅ Group Mode enabled", quoted: msg }); break;
                    case '1.4': await conn.sendMessage(from, { text: "✅ Inbox Mode enabled", quoted: msg }); break;
                    case '2.1': await conn.sendMessage(from, { text: "✅ Auto Recording ON", quoted: msg }); break;
                    case '2.2': await conn.sendMessage(from, { text: "❌ Auto Recording OFF", quoted: msg }); break;
                    case '3.1': await conn.sendMessage(from, { text: "✅ Auto Typing ON", quoted: msg }); break;
                    case '3.2': await conn.sendMessage(from, { text: "❌ Auto Typing OFF", quoted: msg }); break;

                    case 'exit':
                        await conn.sendMessage(from, { text: "✅ Settings menu closed.", quoted: msg });
                        conn.ev.off('messages.upsert', handler);
                        return;

                    default:
                        await conn.sendMessage(from, { text: "❌ Invalid option, please select a valid number.", quoted: msg });
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
