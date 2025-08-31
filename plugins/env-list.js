const { cmd } = require('../command');
const config = require('../config');

let lastEnvMsgId = null;

cmd({
    pattern: "env",
    desc: "Show environment configuration options",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        if (!isOwner) return reply("❌ Owner only!");

        const envOptions = `
⚙️ *Environment Settings Menu*

1. MODE
   1.1 Public
   1.2 Private
   1.3 Group
   1.4 Inbox

2. AUTO VOICE
   2.1 ON
   2.2 OFF

3. AUTO READ STATUS
   3.1 ON
   3.2 OFF

4. AUTO BIO
   4.1 ON
   4.2 OFF

5. NEWS
   5.1 Start
   5.2 Stop

6. AUTO TYPING
   6.1 ON
   6.2 OFF

7. AUTO READ COMMAND
   7.1 ON
   7.2 OFF
        `;

        const sentMsg = await conn.sendMessage(from, { text: envOptions }, { quoted: mek });
        lastEnvMsgId = sentMsg.key.id;

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error displaying config: ${error.message}`);
    }
});


// === Listener for option selections ===
conn.ev.on("messages.upsert", async (msgUpdate) => {
    try {
        const msg = msgUpdate.messages[0];
        if (!msg.message?.extendedTextMessage) return;

        const selectedOption = msg.message.extendedTextMessage.text.trim();
        const contextId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

        // --- Owner check ---
        const jid = msg.key.participant || msg.key.remoteJid;
        const isOwner = jid.endsWith("@s.whatsapp.net") &&
            config.OWNER_NUMBER.replace(/[^0-9]/g, "") === jid.split("@")[0];

        if (!isOwner) return; // Only owner can select
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

    } catch (error) {
        console.error('Env menu option error:', error);
        try {
            await conn.sendMessage(msgUpdate.messages[0].key.remoteJid, {
                text: `❌ Error executing option: ${error.message}`
            });
        } catch (err) {
            console.error("Failed to send error message:", err);
        }
    }
});
