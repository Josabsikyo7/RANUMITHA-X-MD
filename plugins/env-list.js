const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');
const os = require("os");

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
}, 
async (conn, mek, m, { from, quoted, reply, isOwner }) => {
    try {
        // Owner check
        if (!isOwner) {
            return reply("🚫 *Owner Only Command!*");
        }

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
... (rest unchanged)
`;

        // Send config with image and vCard quote  
        const vv = await conn.sendMessage(
            from,
            {
                image: { url: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/Config%20img%20.jpg" },
                caption: envSettings,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: false
                }
            },
            { quoted: mek }
        );

        // Optional PTT voice message
        await conn.sendMessage(
            from,
            {
                audio: { url: 'https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/envlist-music.mp3' },
                mimetype: 'audio/mp4',
                ptt: true
            },
            { quoted: mek }
        );

        // Create one-time listener for reply options
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages[0];
                if (!msg.message || !msg.message.extendedTextMessage) return;

                const selectedOption = msg.message.extendedTextMessage.text.trim();

                // Only Owner can trigger these numbers
                if (!isOwner) return;

                if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                    switch (selectedOption) {
                        case '1.1':
                            reply(".update MODE:public" );
                            reply("*`PUBLIC MOD` Selected successful ✅*");
                            break;
                        case '1.2':               
                            reply(".update MODE:private");
                            reply("*`PRIVATE MOD` Selected successful ✅*");
                            break;
                        case '1.3':               
                            reply(".update MODE:group");
                            reply("*`GROUP MOD` Selected successful ✅*");
                            break;
                        case '1.4':     
                            reply(".update MODE:inbox");
                            reply("*`INBOX MOD` Selected successful ✅*");
                            break;
                        case '2.1':     
                            reply(".update AUTO_VOICE:true");
                            reply(".restart");
                            break;
                        case '2.2':     
                            reply(".update AUTO_VOICE:false");
                            reply(".restart");
                            break;
                        case '3.1':    
                            reply(".update AUTO_READ_STATUS:true");
                            reply(".restart");
                            break;
                        case '3.2':    
                            reply(".update AUTO_READ_STATUS:false");
                            reply(".restart");
                            break;
                        case '4.1': 
                            reply(".update AUTO_BIO:true");
                            reply(".restart");
                            break;
                        case '4.2': 
                            reply(".update AUTO_BIO:false");
                            reply(".restart");
                            break;
                        case '5.1': 
                            reply(".startnews");
                            break;
                        case '5.2': 
                            reply(".stopnews");
                            break;
                        case '6.1':      
                            reply(".update AUTO_TYPING:true");
                            reply(".restart");
                            break;
                        case '6.2':   
                            reply(".update AUTO_TYPING:false");
                            reply(".restart");
                            break;
                        case '7.1': 
                            reply(".update AUTO_READ_CMD:true");
                            reply(".restart");
                            break;
                        case '7.2':   
                            reply(".update AUTO_READ_CMD:false");
                            reply(".restart");
                            break;
                        default:
                            reply("Invalid option. Please select a valid option 🔴");
                    }
                }
            } catch (err) {
                console.error('Option select error:', err);
                reply(`❌ Error processing option: ${err.message}`);
            }
        });

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error displaying config: ${error.message}`);
    }
});
