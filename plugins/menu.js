const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');
const os = require("os");

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
    pattern: "menu",
    alise: ["getmenu","list","ranulist","ranumenu"],
    desc: "Show interactive menu system",
    category: "menu",
    react: "📂",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
    
            // Count total commands
        const totalCommands = Object.keys(commands).length;
        
        const info = `👋 *𝘏𝘌𝘓𝘓𝘖𝘞* ${pushname} 

 🎀 𝗪elcome to RANUMITHA-X-MD🎗️

*╭──「 MENU 」*
*│*🐼 *\`Bot\`*: *𝐑𝐀𝐍𝐔𝐌𝐈𝐓𝐇𝐀-𝐗-𝐌𝐃*
*│*👤 *\`User\`*: ${pushname}
*│*👨‍💻 *\`Owner\`*: *ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ*
*│*⏰ *\`Uptime\`*: ${runtime(process.uptime())}
*│*⏳ *\`Ram\`*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
*│*🫟 *\`Version\`*: ${config.BOT_VERSION}
*│*🪙 *\`Commands\`*: ${totalCommands}
*│*🖊️ *\`Prefix\`*: ${config.PREFIX}
╰───────────────●●►

*1. │  🤵‍♂ -* Owner Menu
*2. │  🤖 -* Ai Menu
*3. │  🔍 -* Search Menu
*4. │  📥 -* Download Menu
*5. │  😁 -* Fun Menu
*6. │  📂 -* Main Menu
*7. │  🔄 -* Convert Menu
*8. │  📌 -* Other Menu
*9. │  🎨 -* Logo Menu
*10.│ 🖼️ -* Imagine Menu
*11.│ 👥 -* Group Menu
*12.│ ⚙️ -* Setting Menu

> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;
        const image = "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/IMG-20250711-WA0010.jpg"; // define image url
        const audioUrl = "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/menujs-audio.mp3"; // audio url / local file

        // Send image
        const sentMsg = await conn.sendMessage(
            from,
            { image: { url: image }, caption: info },
            { quoted: mek }
        );

        const messageID = sentMsg.key.id; // get sent message ID

        // Send audio (voice note style)
        await conn.sendMessage(
            from,
            { audio: { url: audioUrl }, mimetype: 'audio/mp4', ptt: true },
            { quoted: mek }
        );

        // Listen for user reply
conn.ev.on('messages.upsert', async (msgUpdate) => {
    const mekInfo = msgUpdate?.messages[0];
    if (!mekInfo?.message) return;

    const fromUser = mekInfo.key.remoteJid;
    const textMsg =
        mekInfo.message.conversation ||
        mekInfo.message.extendedTextMessage?.text;

    const quotedId =
        mekInfo.message?.extendedTextMessage?.contextInfo?.stanzaId;

    // check user replied to menu message
    if (quotedId !== messageID) return;

    let userReply = textMsg?.trim();

    if (/^(1|2|3|4|5|6|7|8|9|10|11|12)$/.test(userReply)) {
        // ✅ react
        await conn.sendMessage(fromUser, {
            react: { text: '✅', key: mekInfo.key }
        });

        // send reply menu text
        switch (userReply) {
            case "1":
                await conn.sendMessage(fromUser, { text: "🤵‍♂️ Owner Menu" }, { quoted: mekInfo });
                break;
            case "2":
                await conn.sendMessage(fromUser, { text: "🤖 AI Menu" }, { quoted: mekInfo });
                break;
            case "3":
                await conn.sendMessage(fromUser, { text: "🔍 Search Menu" }, { quoted: mekInfo });
                break;
            case "4":
                await conn.sendMessage(fromUser, { text: "📥 Download Menu" }, { quoted: mekInfo });
                break;
            case "5":
                await conn.sendMessage(fromUser, { text: "😁 Fun Menu" }, { quoted: mekInfo });
                break;
            case "6":
                await conn.sendMessage(fromUser, { text: "📂 Main Menu" }, { quoted: mekInfo });
                break;
            case "7":
                await conn.sendMessage(fromUser, { text: "🔄 Convert Menu" }, { quoted: mekInfo });
                break;
            case "8":
                await conn.sendMessage(fromUser, { text: "📌 Other Menu" }, { quoted: mekInfo });
                break;
            case "9":
                await conn.sendMessage(fromUser, { text: "🎨 Logo Menu" }, { quoted: mekInfo });
                break;
            case "10":
                await conn.sendMessage(fromUser, { text: "🖼️ Imagine Menu" }, { quoted: mekInfo });
                break;
            case "11":
                await conn.sendMessage(fromUser, { text: "👥 Group Menu" }, { quoted: mekInfo });
                break;
            case "12":
                await conn.sendMessage(fromUser, { text: "⚙️ Setting Menu" }, { quoted: mekInfo });
                break;
        }
    } else {
        await conn.sendMessage(fromUser, { text: "❌ Invalid choice! Reply with 1-12" }, { quoted: mekInfo });
    }
});
    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *Main error:* ${error.message || "Error!"}`);
    }
});
