const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');
const os = require("os")

// Reusable function to check boolean envs
function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

// Fake ChatGPT vCard
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© Mr Hiruka",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Meta
ORG:META AI;
TEL;type=CELL;type=VOICE;waid=13135550002:+13135550002
END:VCARD`
        }
    }
};

cmd({
    pattern: "env",
    alias: ["config", "settings", "setting"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        // Non-owner access
        if (!isOwner) {
            // React ❌
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("🚫 *Only Owner Can Access!*");
        }

        // Menu text for owner
        let envSettings = `╭─『 ⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 𝗠𝗘𝗡𝗨 ⚙️ 』───❏
│
├─❏ *🔖 BOT INFO*
├─∘ *Name:* RANUMITHA-X-MD
├─∘ *Prefix:* ${config.PREFIX}
├─∘ *Owner:* ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ
├─∘ *Number:* ${config.OWNER_NUMBER}
├─∘ *Version:* ${config.BOT_VERSION}
└─∘ *Mode:* ${config.MODE.toUpperCase()}
    
      ╭─ 🛡️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 🛡️ ─╮
╭───────────────────╮
│ SELECT WORK MODE *${config.MODE.toUpperCase()}*  |
╰───────────────────╯ 
  ┣ 1.1  Public  
  ┣ 1.2  Private 
  ┣ 1.3  Group   
  ┗ 1.4  Inbox

╭──────────────────╮
│ Auto Recording: ${isEnabled(config.AUTO_RECORDING) ? "✅" : "❌"}                 |
╰──────────────────╯ 
  ┣ 2.1  true  ✅ 
  ┗ 2.2  false ❌

╭──────────────────╮
│ Auto Typing: ${isEnabled(config.AUTO_TYPING) ? "✅" : "❌"}                        |
╰──────────────────╯ 
  ┣ 3.1  true  ✅ 
  ┗ 3.2  false ❌

╭──────────────────╮
│ Always Online: ${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"}                    |
╰──────────────────╯ 
  ┣ 4.1  true  ✅ 
  ┗ 4.2  false ❌

╭──────────────────╮
│ Public Mod: ${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"}                         |
╰──────────────────╯ 
  ┣ 5.1  true  ✅ 
  ┗ 5.2  false ❌

╭──────────────────╮
│ Auto Voice: ${isEnabled(config.AUTO_VOICE) ? "✅" : "❌"}                          |
╰──────────────────╯ 
  ┣ 6.1  true  ✅ 
  ┗ 6.2  false ❌

╭──────────────────╮
│ Auto Sticker: ${isEnabled(config.AUTO_STICKER) ? "✅" : "❌"}                       |
╰──────────────────╯ 
  ┣ 7.1  true  ✅ 
  ┗ 7.2  false ❌

╭──────────────────╮
│ Auto Reply: ${isEnabled(config.AUTO_STATUS_REPLY) ? "✅" : "❌"}                          |
╰──────────────────╯ 
  ┣ 8.1  true  ✅ 
  ┗ 8.2  false ❌

╭──────────────────╮
│ Auto React: ${isEnabled(config.AUTO_REACT) ? "✅" : "❌"}                         |
╰──────────────────╯ 
  ┣ 9.1  true  ✅ 
  ┗ 9.2  false ❌

╭──────────────────╮
│ Auto Status Seen: ${isEnabled(config.AUTO_STATUS_SEEN) ? "✅" : "❌"}              |
╰──────────────────╯ 
  ┣ 10.1  true  ✅ 
  ┗ 10.2  false ❌

╭──────────────────╮
│ Auto Status Reply: ${isEnabled(config.AUTO_STATUS_REPLY) ? "✅" : "❌"}             |
╰──────────────────╯ 
  ┣ 11.1  true  ✅ 
  ┗ 11.2  false ❌

╭──────────────────╮
│ Auto Status React: ${isEnabled(config.AUTO_STATUS_REACT) ? "✅" : "❌"}             |
╰──────────────────╯ 
  ┣ 12.1  true  ✅ 
  ┗ 12.2 false ❌

╭──────────────────╮
│ Custom React: ${isEnabled(config.CUSTOM_REACT) ? "✅" : "❌"}                   |
╰──────────────────╯ 
  ┣ 13.1  true  ✅ 
  ┗ 13.2  false ❌

╭──────────────────╮
│ Anti VV: ${isEnabled(config.ANTI_VV) ? "✅" : "❌"}                                |
╰──────────────────╯ 
  ┣ 14.1  true  ✅ 
  ┗ 14.2  false ❌

╭──────────────────╮
│ Welcome: ${isEnabled(config.WELCOME) ? "✅" : "❌"}                            |
╰──────────────────╯ 
  ┣ 15.1  true  ✅ 
  ┗ 15.2  false ❌

╭──────────────────╮
│ Admin Events: ${isEnabled(config.ADMIN_EVENTS) ? "✅" : "❌"}                    |
╰──────────────────╯ 
  ┣ 16.1  true  ✅ 
  ┗ 16.2  false ❌

╭──────────────────╮
│ Anti Link: ${isEnabled(config.ANTI_LINK) ? "✅" : "❌"}                              |
╰──────────────────╯ 
  ┣ 17.1  true  ✅ 
  ┗ 17.2  false ❌

╭──────────────────╮
│ Read Message: ${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"}                  |
╰──────────────────╯ 
  ┣ 18.1  true  ✅ 
  ┗ 18.2  false ❌

╭──────────────────╮
│ Anti Bad: ${isEnabled(config.ANTI_BAD) ? "✅" : "❌"}                              |
╰──────────────────╯ 
  ┣ 19.1  true  ✅ 
  ┗ 19.2  false ❌

╭──────────────────╮
│ Anti Link Kick: ${isEnabled(config.ANTI_LINK_KICK) ? "✅" : "❌"}                     |
╰──────────────────╯ 
  ┣ 20.1  true  ✅ 
  ┗ 20.2  false ❌

╭──────────────────╮
│ Read CMD: ${isEnabled(config.READ_CMD) ? "✅" : "❌"}                          |
╰──────────────────╯ 
  ┣ 21.1  true  ✅ 
  ┗ 21.2  false ❌

> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // Send menu image
        const menuMsg = await conn.sendMessage(from, {
            image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
            caption: envSettings
        }, { quoted: fakevCard });

        // Send menu voice
        await conn.sendMessage(from, {
            audio: { url: "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3" },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // Listener for replies
        const handler = async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const replySender = msg.key.participant || msg.key.remoteJid;
            const selectedOption = msg.message.extendedTextMessage.text.trim();

            // Check if the message is a reply to the menu
            const context = msg.message.extendedTextMessage.contextInfo;
            if (!context?.stanzaId || context.stanzaId !== menuMsg.key.id) return;

            // Verify owner
            const senderIsOwner = replySender === conn.user.id || isOwner;
            if (!senderIsOwner) {
                await conn.sendMessage(from, { react: { text: "❌", key: msg.key } });
                await conn.sendMessage(from, { text: "*🚫 Only Owner can access settings!*" }, { quoted: msg });
                return;
            }

            // React ✅ for owner
            await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });

            // Handle options
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

            // Remove listener after first reply
            conn.ev.off('messages.upsert', handler);
        };

        conn.ev.on('messages.upsert', handler);

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error: ${error.message}`);
    }
});
