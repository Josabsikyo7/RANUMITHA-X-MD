const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

// Reusable function to check boolean envs
function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["config", "settings", "setting"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply ,isOwner, isCreator }) => {
    try {
        if (!isOwner) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("🚫 *Only Owner Can Access!*");
        }

        let envSettings = `╭─『 ⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 𝗠𝗘𝗡𝗨 ⚙️ 』───❏
│
├─❏ *🔖 BOT INFO*
├─∘ *Name:* RANUMITHA-X-MD
├─∘ *Prefix:* ${config.PREFIX}
├─∘ *Owner:* ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ
├─∘ *Number:* ${config.OWNER_NUMBER}
├─∘ *Version:* ${config.BOT_VERSION}
└─∘ *Mode:* ${config.MODE.toUpperCase()}

> Reply with numbers (e.g. 2.1 / 2.2)`;

        const menuMsg = await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // listener
        const handler = async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();
            const context = msg.message.extendedTextMessage.contextInfo;
            if (!context?.stanzaId || context.stanzaId !== menuMsg.key.id) return;

            // ✅ react for valid numbers
            if (/^(\d{1.1,1.2,1.3,1.4,2.1,2.2,3.1,3.2}\.\d)$/.test(selectedOption)) {
                await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
            }

            // switch
            switch (selectedOption) {
                // 1.x Work modes
                case '1.1': await reply("✅ Public Mode enabled"); break;
                case '1.2': await reply("✅ Private Mode enabled"); break;
                case '1.3': await reply("✅ Group Mode enabled"); break;
                case '1.4': await reply("✅ Inbox Mode enabled"); break;

                // 2.x Auto Recording
                case '2.1': await reply("✅ Auto Recording ON"); break;
                case '2.2': await reply("❌ Auto Recording OFF"); break;

                // 3.x Auto Typing
                case '3.1': await reply("✅ Auto Typing ON"); break;
                case '3.2': await reply("❌ Auto Typing OFF"); break;

                // 4.x Always Online
                case '4.1': await reply("✅ Always Online ON"); break;
                case '4.2': await reply("❌ Always Online OFF"); break;

                // 5.x Public Mod
                case '5.1': await reply("✅ Public Mod ON"); break;
                case '5.2': await reply("❌ Public Mod OFF"); break;

                // 6.x Auto Voice
                case '6.1': await reply("✅ Auto Voice ON"); break;
                case '6.2': await reply("❌ Auto Voice OFF"); break;

                // 7.x Auto Sticker
                case '7.1': await reply("✅ Auto Sticker ON"); break;
                case '7.2': await reply("❌ Auto Sticker OFF"); break;

                // 8.x Auto Reply
                case '8.1': await reply("✅ Auto Reply ON"); break;
                case '8.2': await reply("❌ Auto Reply OFF"); break;

                // 9.x Auto React
                case '9.1': await reply("✅ Auto React ON"); break;
                case '9.2': await reply("❌ Auto React OFF"); break;

                // 10.x Auto Status Seen
                case '10.1': await reply("✅ Auto Status Seen ON"); break;
                case '10.2': await reply("❌ Auto Status Seen OFF"); break;

                // 11.x Auto Status Reply
                case '11.1': await reply("✅ Auto Status Reply ON"); break;
                case '11.2': await reply("❌ Auto Status Reply OFF"); break;

                // 12.x Auto Status React
                case '12.1': await reply("✅ Auto Status React ON"); break;
                case '12.2': await reply("❌ Auto Status React OFF"); break;

                // 13.x Custom React
                case '13.1': await reply("✅ Custom React ON"); break;
                case '13.2': await reply("❌ Custom React OFF"); break;

                // 14.x Anti VV
                case '14.1': await reply("✅ Anti VV ON"); break;
                case '14.2': await reply("❌ Anti VV OFF"); break;

                // 15.x Welcome
                case '15.1': await reply("✅ Welcome ON"); break;
                case '15.2': await reply("❌ Welcome OFF"); break;

                // 16.x Admin Events
                case '16.1': await reply("✅ Admin Events ON"); break;
                case '16.2': await reply("❌ Admin Events OFF"); break;

                // 17.x Anti Link
                case '17.1': await reply("✅ Anti Link ON"); break;
                case '17.2': await reply("❌ Anti Link OFF"); break;

                // 18.x Read Message
                case '18.1': await reply("✅ Read Message ON"); break;
                case '18.2': await reply("❌ Read Message OFF"); break;

                // 19.x Anti Bad
                case '19.1': await reply("✅ Anti Bad ON"); break;
                case '19.2': await reply("❌ Anti Bad OFF"); break;

                // 20.x Anti Link Kick
                case '20.1': await reply("✅ Anti Link Kick ON"); break;
                case '20.2': await reply("❌ Anti Link Kick OFF"); break;

                // 21.x Read CMD
                case '21.1': await reply("✅ Read CMD ON"); break;
                case '21.2': await reply("❌ Read CMD OFF"); break;

                case 'exit':
                    await reply("✅ Settings menu closed.");
                    conn.ev.off('messages.upsert', handler);
                    return;

                default:
                    await reply("❌ Invalid option, please select correctly.");
            }
        };

        conn.ev.on('messages.upsert', handler);

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error: ${error.message}`);
    }
});
