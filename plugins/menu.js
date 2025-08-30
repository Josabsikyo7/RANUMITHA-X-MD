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
        
        const menuCaption = `👋 *𝘏𝘌𝘓𝘓𝘖𝘞* ${pushname} 

 🎀 𝗪elcome to RANUMITHA-X-MD🎗️


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

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: false,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '',
                newsletterName: '',
                serverMessageId: 143
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/IMG-20250711-WA0010.jpg' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: fakevCard }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Listen for user reply only once!
        conn.ev.on('messages.upsert', async (messageUpdate) => { 
            try {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message) return;

                const messageType = mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text;
                const isReplyToSentMsg = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToSentMsg) return;

                let userReply = messageType.trim();
                let msg;
                let type;
                let response;
                
                if (userReply === "1.1") {
                    msg = await conn.sendMessage(from, { text: "⏳ Processing..." }, { quoted: fakevCard });
                    
                    
                } else if (userReply === "1.2") {
                    msg = await conn.sendMessage(from, { text: "⏳ Processing..." }, { quoted: fakevCard });
                    
                    
                } else { 
                    return await reply("❌ Invalid choice! Reply with 1.1 or 1.2.");
                

                

            } catch (error) {
                console.error(error);
                await reply(`❌ *An error occurred while processing:* ${error.message || "Error!"}`);
            }
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
    }
});
                               
