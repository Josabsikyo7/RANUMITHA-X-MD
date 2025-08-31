const config = require('../config');
const { cmd } = require('../command');

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

// Owner JID
function getOwnerJid() {
    if (!config.OWNER_NUMBER) return null;
    return config.OWNER_NUMBER.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
}

// Bot JID
function getBotJid() {
    if (!config.BOT_NUMBER) return null;
    return config.BOT_NUMBER.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
}

cmd({
    pattern: "env",
    alias: ["config","settings","setting"],
    desc: "Show bot configuration (Owner Only Access)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const ownerJid = getOwnerJid();
    const botJid = getBotJid();

    if (!ownerJid) return reply("❌ OWNER_NUMBER not set in config.js");

    try {
        const senderJid = mek.sender;

        // Menu text
        let envSettings = `╭─『 ⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 𝗠𝗘𝗡𝗨 ⚙️ 』───❏
├─❏ *🔖 BOT INFO*
├─∘ *Name:* RANUMITHA-X-MD
├─∘ *Prefix:* ${config.PREFIX}
├─∘ *Owner:* ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ
├─∘ *Number:* ${config.OWNER_NUMBER}
├─∘ *Version:* ${config.BOT_VERSION}
└─∘ *Mode:* ${config.MODE.toUpperCase()}
> Reply with correct number (e.g. 2.1, 10.2)`;

        // Send menu image
        const menuMsg = await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        }, { quoted: mek });

        // Send menu audio
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4', ptt: true
        }, { quoted: mek });

        const allowedOptions = [
            "1.1","1.2","1.3","1.4","2.1","2.2","3.1","3.2","4.1","4.2",
            "5.1","5.2","6.1","6.2","7.1","7.2","8.1","8.2","9.1","9.2",
            "10.1","10.2","11.1","11.2","12.1","12.2","13.1","13.2","14.1","14.2",
            "15.1","15.2","16.1","16.2","17.1","17.2","18.1","18.2","19.1","19.2",
            "20.1","20.2","21.1","21.2"
        ];

        // Allowed JIDs = Owner + Bot
        const accessJid = [ownerJid];
        if (botJid) accessJid.push(botJid);

        const handler = async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const replySender = msg.key.participant || msg.key.remoteJid;
            const selectedOption = msg.message.extendedTextMessage.text.trim();
            const context = msg.message.extendedTextMessage.contextInfo;

            if (!context?.stanzaId || context.stanzaId !== menuMsg.key.id) return;

            // Only Owner or Bot Number can reply
            if (!accessJid.includes(replySender)) {
                await conn.sendMessage(from, { react: { text: "❌", key: msg.key } });
                await conn.sendMessage(from, { text: "*🚫 Only Owner can interact!*", quoted: msg });
                return;
            }

            // Invalid option
            if (!allowedOptions.includes(selectedOption)) {
                await conn.sendMessage(from, { react: { text: "⚠️", key: msg.key } });
                await conn.sendMessage(from, { text: "❌ Invalid option! Please select correct number.", quoted: msg });
                return;
            }

            // React ✅
            await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });

            try {
                switch(selectedOption){
                    case '1.1': await reply("✅ Public Mode enabled"); break;
                    case '1.2': await reply("✅ Private Mode enabled"); break;
                    case '1.3': await reply("✅ Group Mode enabled"); break;
                    case '1.4': await reply("✅ Inbox Mode enabled"); break;
                    case '2.1': await reply("✅ Auto Recording ON"); break;
                    case '2.2': await reply("❌ Auto Recording OFF"); break;
                    case '3.1': await reply("✅ Auto Typing ON"); break;
                    case '3.2': await reply("❌ Auto Typing OFF"); break;
                    case '4.1': await reply("✅ Always Online ON"); break;
                    case '4.2': await reply("❌ Always Online OFF"); break;
                    case '5.1': await reply("✅ Public Mod ON"); break;
                    case '5.2': await reply("❌ Public Mod OFF"); break;
                    case '6.1': await reply("✅ Auto Voice ON"); break;
                    case '6.2': await reply("❌ Auto Voice OFF"); break;
                    case '7.1': await reply("✅ Auto Sticker ON"); break;
                    case '7.2': await reply("❌ Auto Sticker OFF"); break;
                    case '8.1': await reply("✅ Auto Reply ON"); break;
                    case '8.2': await reply("❌ Auto Reply OFF"); break;
                    case '9.1': await reply("✅ Auto React ON"); break;
                    case '9.2': await reply("❌ Auto React OFF"); break;
                    case '10.1': await reply("✅ Auto Status Seen ON"); break;
                    case '10.2': await reply("❌ Auto Status Seen OFF"); break;
                    case '11.1': await reply("✅ Auto Status Reply ON"); break;
                    case '11.2': await reply("❌ Auto Status Reply OFF"); break;
                    case '12.1': await reply("✅ Auto Status React ON"); break;
                    case '12.2': await reply("❌ Auto Status React OFF"); break;
                    case '13.1': await reply("✅ Custom React ON"); break;
                    case '13.2': await reply("❌ Custom React OFF"); break;
                    case '14.1': await reply("✅ Anti VV ON"); break;
                    case '14.2': await reply("❌ Anti VV OFF"); break;
                    case '15.1': await reply("✅ Welcome ON"); break;
                    case '15.2': await reply("❌ Welcome OFF"); break;
                    case '16.1': await reply("✅ Admin Events ON"); break;
                    case '16.2': await reply("❌ Admin Events OFF"); break;
                    case '17.1': await reply("✅ Anti Link ON"); break;
                    case '17.2': await reply("❌ Anti Link OFF"); break;
                    case '18.1': await reply("✅ Read Message ON"); break;
                    case '18.2': await reply("❌ Read Message OFF"); break;
                    case '19.1': await reply("✅ Anti Bad ON"); break;
                    case '19.2': await reply("❌ Anti Bad OFF"); break;
                    case '20.1': await reply("✅ Anti Link Kick ON"); break;
                    case '20.2': await reply("❌ Anti Link Kick OFF"); break;
                    case '21.1': await reply("✅ Read CMD ON"); break;
                    case '21.2': await reply("❌ Read CMD OFF"); break;
                }
            } catch(err) {
                if(ownerJid) await conn.sendMessage(ownerJid, { text: `❌ Env command error: ${err.message}` });
                if(botJid) await conn.sendMessage(botJid, { text: `❌ Env command error: ${err.message}` });
                console.error('Env command error:', err);
            }
        };

        conn.ev.on('messages.upsert', handler);

    } catch(error){
        console.error('Env command error:', error);
        if(ownerJid) await conn.sendMessage(ownerJid, { text: `❌ Env command error: ${error.message}` });
        if(botJid) await conn.sendMessage(botJid, { text: `❌ Env command error: ${error.message}` });
        await reply(`❌ Error: ${error.message}`);
    }
});
