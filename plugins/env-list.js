const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "env",
    alias: ["config", "settings", "setting"],
    desc: "Show bot configuration variables (Owner Reply Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner, isCreator }) => {
    try {
        let envSettings = `╭─『 ⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 𝗠𝗘𝗡𝗨 ⚙️ 』───❏
│
├─❏ *🔖 BOT INFO*
├─∘ *Name:* RANUMITHA-X-MD
├─∘ *Prefix:* ${config.PREFIX}
├─∘ *Owner:* ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ
├─∘ *Version:* ${config.BOT_VERSION}
└─∘ *Mode:* ${config.MODE.toUpperCase()}

> Reply with numbers (e.g. 2.1 / 2.2) or type 'exit' to close.`;

        // send menu with image
        const menuMsg = await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        }, { quoted: mek });

        // send background audio
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // --- HANDLER ---
        const handler = async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages[0];
                if (!msg.message) return;

                let text = msg.message.conversation 
                        || msg.message.extendedTextMessage?.text;
                if (!text) return;

                text = text.trim();

                // 🔒 allow only owner
                let sender = msg.key.participant || msg.key.remoteJid;
                if (!await isOwner(sender)) {
                    await conn.sendMessage(from, { react: { text: "❌", key: msg.key } });
                    return reply("🚫 Only *Owner* can reply with menu numbers!");
                }

                // ✅ react if valid reply
                if (/^(\d{1.1,1.2,1.3,1.4,2.1,2.2}\.\d)$/.test(text)) {
                    await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
                }

                switch (text) {
                    case '1.1': await reply("✅ Public Mode enabled"); break;
                    case '1.2': await reply("✅ Private Mode enabled"); break;
                    case '2.1': await reply("✅ Auto Recording ON"); break;
                    case '2.2': await reply("❌ Auto Recording OFF"); break;
                    // ... (oyaṭa thiyena list okkoma ganna puluwan mehema continue karanna)
                    case 'exit':
                        await reply("✅ Settings menu closed.");
                        conn.ev.off('messages.upsert', handler);
                        return;
                    default:
                        if (/^(\d{1,2}\.\d)$/.test(text)) {
                            await reply("❌ Invalid option, please select correctly.");
                        }
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
