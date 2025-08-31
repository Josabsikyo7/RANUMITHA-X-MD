const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const os = require("os");

// ✅ Boolean checker
function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

let lastEnvMsgId = null;

cmd({
    pattern: "env",
    alias: ["config", "settings", "setting"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, 
async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        if (!isOwner) return reply("🚫 *Owner Only Command!*");

        let envSettings = `╭───『 *${config.BOT_NAME} CONFIG* 』───❏
│
├─❏ *🤖 BOT INFO*
│  ├─∘ *Name:* ${config.BOT_NAME}
│  ├─∘ *Prefix:* ${config.PREFIX}
│  ├─∘ *Owner:* ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ
│  ├─∘ *Number:* ${config.OWNER_NUMBER}
│  ├─∘ *Version:* ${config.BOT_VERSION}
│  └─∘ *Mode:* ${config.MODE.toUpperCase()}
│
├─❏ *⚙️ CORE SETTINGS*
│  ├─∘ *Public Mode:* ${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"}
│  ├─∘ *Always Online:* ${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"}
│  ├─∘ *Read Msgs:* ${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"}
│  └─∘ *Read Cmds:* ${isEnabled(config.READ_CMD) ? "✅" : "❌"}
│
├─❏ *🔌 AUTOMATION*
│  ├─∘ *Auto Reply:* ${isEnabled(config.AUTO_REPLY) ? "✅" : "❌"}
│  ├─∘ *Auto React:* ${isEnabled(config.AUTO_REACT) ? "✅" : "❌"}
│  ├─∘ *Custom React:* ${isEnabled(config.CUSTOM_REACT) ? "✅" : "❌"}
│  ├─∘ *React Emojis:* ${config.CUSTOM_REACT_EMOJIS}
│  ├─∘ *Auto Sticker:* ${isEnabled(config.AUTO_STICKER) ? "✅" : "❌"}
│  └─∘ *Auto Voice:* ${isEnabled(config.AUTO_VOICE) ? "✅" : "❌"}
│
├─❏ *📢 STATUS SETTINGS*
│  ├─∘ *Status Seen:* ${isEnabled(config.AUTO_STATUS_SEEN) ? "✅" : "❌"}
│  └─∘ *Status React:* ${isEnabled(config.AUTO_STATUS_REACT) ? "✅" : "❌"}
│
├─❏ *🛡️ SECURITY*
│  └─∘ *Anti-VV:* ${isEnabled(config.ANTI_VV) ? "✅" : "❌"} 
│
├─❏ *🎨 MEDIA*
│  ├─∘ *Alive Msg:* ${config.ALIVE_MSG}
│  └─∘ *Sticker Pack:* ${config.STICKER_NAME}
│
├─❏ *⏳ MISC*
│  ├─∘ *Auto Typing:* ${isEnabled(config.AUTO_TYPING) ? "✅" : "❌"}
│  ├─∘ *Auto Record:* ${isEnabled(config.AUTO_RECORDING) ? "✅" : "❌"}
│  ├─∘ *Anti-Del Path:* ${config.ANTI_DEL_PATH}
│  └─∘ *Dev Number:* ${config.DEV}
│
╰──────❏


┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃       🔧 OPTIONS MENU 🔧
┃━━━━━━━━━━━━━━━━━━━━━━━┃

┣━ WORK MODE ⤵
┃   ┣ 1.1 🔹 Public Work
┃   ┣ 1.2 🔹 Private Work
┃   ┣ 1.3 🔹 Group Only
┃   ┗ 1.4 🔹 Inbox Only

┣━ AUTO VOICE ⤵
┃   ┣ 2.1 🔊 Auto Voice On
┃   ┗ 2.2 🔕 Auto Voice Off

┣━ AUTO STATUS SEEN ⤵
┃   ┣ 3.1 👁‍🗨 Auto Read Status On
┃   ┗ 3.2 👁❌ Auto Read Status Off

┣━ AUTO BIO ⤵
┃   ┣ 4.1 ✍ Auto Bio On
┃   ┗ 4.2 ✍❌ Auto Bio Off

┣━ 24/7 NEWS SERVICE ⤵
┃   ┣ 5.1 📰 Activate News Service
┃   ┗ 5.2 🛑 Deactivate News Service

┣━ AUTO TYPING ⤵
┃   ┣ 6.1 📝 Activate Auto Typing
┃   ┗ 6.2 📝❌ Deactivate Auto Typing

┣━ AUTO COMMAND READ ⤵
┃   ┣ 7.1 🖊 Activate Auto Command Read
┃   ┗ 7.2 🖊❌ Deactivate Auto Command Read
┗━━━━━━━━━━━━━━━━━━━━━━━┛

> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        const vv = await conn.sendMessage(
            from,
            {
                image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
                caption: envSettings,
                contextInfo: { mentionedJid: [m.sender] }
            },
            { quoted: mek }
        );

        lastEnvMsgId = vv.key.id;

        await conn.sendMessage(
            from,
            {
                audio: { url: 'https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3' },
                mimetype: 'audio/mp4',
                ptt: true
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error displaying config: ${error.message}`);
    }
});

// 📌 Listener - Owner Only (use isOwner)
conn.ev.on("messages.upsert", async (msgUpdate) => {
    const msg = msgUpdate.messages[0];
    if (!msg.message?.extendedTextMessage) return;

    const selectedOption = msg.message.extendedTextMessage.text.trim();
    const contextId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

    // --- Add isOwner check ---
    const jid = msg.key.participant || msg.key.remoteJid;
    const isOwner = jid.endsWith("@s.whatsapp.net") &&
        config.OWNER_NUMBER.replace(/[^0-9]/g, "") === jid.split("@")[0];

    if (!isOwner) return; // only owner

    if (contextId !== lastEnvMsgId) return;

    switch (selectedOption) {
        case '1.1':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update MODE:public\n✅ PUBLIC MODE Selected" });
            break;
        case '1.2':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update MODE:private\n✅ PRIVATE MODE Selected" });
            break;
        case '1.3':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update MODE:group\n✅ GROUP MODE Selected" });
            break;
        case '1.4':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update MODE:inbox\n✅ INBOX MODE Selected" });
            break;
        case '2.1':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_VOICE:true\n.restart" });
            break;
        case '2.2':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_VOICE:false\n.restart" });
            break;
        case '3.1':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_READ_STATUS:true\n.restart" });
            break;
        case '3.2':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_READ_STATUS:false\n.restart" });
            break;
        case '4.1':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_BIO:true\n.restart" });
            break;
        case '4.2':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_BIO:false\n.restart" });
            break;
        case '5.1':
            await conn.sendMessage(msg.key.remoteJid, { text: ".startnews" });
            break;
        case '5.2':
            await conn.sendMessage(msg.key.remoteJid, { text: ".stopnews" });
            break;
        case '6.1':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_TYPING:true\n.restart" });
            break;
        case '6.2':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_TYPING:false\n.restart" });
            break;
        case '7.1':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_READ_CMD:true\n.restart" });
            break;
        case '7.2':
            await conn.sendMessage(msg.key.remoteJid, { text: ".update AUTO_READ_CMD:false\n.restart" });
            break;
        default:
            await conn.sendMessage(msg.key.remoteJid, { text: "❌ Invalid option. Owner Only!" });
    }
});

        

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error displaying config: ${error.message}`);
    }
});
