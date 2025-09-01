const config = require('../config');
const { cmd, commands } = require('../command');

// Helper function to check boolean envs
function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

// Fake ChatGPT vCard
const fakevCard = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: { contactMessage: { displayName: "© Mr Hiruka", vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Meta\nORG:META AI;\nTEL;type=CELL;type=VOICE;waid=13135550002:+13135550002\nEND:VCARD` } }
};

cmd({
    pattern: "env",
    alias: ["config", "settings", "setting"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
    try {
        if (!isOwner) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("🚫 *Owner Only Command!*");
        }

        const totalCommands = Object.keys(commands).length;

        const info = `╭─『 ⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 𝗠𝗘𝗡𝗨 ⚙️ 』───❏
│ Bot Name: RANUMITHA-X-MD
│ Prefix: ${config.PREFIX}
│ Owner: ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ
│ Number: ${config.OWNER_NUMBER}
│ Version: ${config.BOT_VERSION}
│
│ 1.1 Public  1.2 Private  1.3 Group  1.4 Inbox
│ 2.1 Auto-Recording On  2.2 Off
│ 3.1 Auto-Typing On  3.2 Off
│ 4.1 Always Online On  4.2 Off
│ 5.1 Public Mod On  5.2 Off
│ ... (Other settings 6-20)
╰───────────────────❏`;

        const image = "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/IMG-20250711-WA0010.jpg";
        const audioUrl = "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/menujs-audio.mp3";

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: fakevCard });
        const messageID = sentMsg.key.id;

        await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });

        // Map reply number to command
        const replyMap = {
            '1.1': ".mode public", '1.2': ".mode private", '1.3': ".mode group", '1.4': ".mode inbox",
            '2.1': ".auto-recording on", '2.2': ".auto-recording off",
            '3.1': ".auto-typing on", '3.2': ".auto-typing off",
            '4.1': ".always-online on", '4.2': ".always-online off",
            '5.1': ".public-mod on", '5.2': ".public-mod off",
            '6.1': ".auto-voice on", '6.2': ".auto-voice off",
            '7.1': ".auto-sticker on", '7.2': ".auto-sticker off",
            '8.1': ".auto-reply on", '8.2': ".auto-reply off",
            '9.1': ".auto-react on", '9.2': ".auto-react off",
            '10.1': ".auto-seen on", '10.2': ".auto-seen off",
            '11.1': ".status-reply on", '11.2': ".status-reply off",
            '12.1': ".status-react on", '12.2': ".status-react off",
            '13.1': ".customreact on", '13.2': ".customreact off",
            '14.1': ".anti-vv on", '14.2': ".anti-vv off",
            '15.1': ".welcome on", '15.2': ".welcome off",
            '16.1': ".antilink on", '16.2': ".antilink off",
            '17.1': ".read-message on", '17.2': ".read-message off",
            '18.1': ".anti-bad on", '18.2': ".anti-bad off",
            '19.1': ".antilinkkick on", '19.2': ".antilinkkick off",
            '20.1': ".read-cmd on", '20.2': ".read-cmd off"
        };

        // Listen for user reply once
        const listener = async (msgUpdate) => {
            const mekInfo = msgUpdate?.messages[0];
            if (!mekInfo?.message) return;

            const fromUser = mekInfo.key.remoteJid;
            const textMsg = mekInfo.message.conversation || mekInfo.message.extendedTextMessage?.text;
            const quotedId = mekInfo.message?.extendedTextMessage?.contextInfo?.stanzaId;

            if (quotedId !== messageID) return;

            const userReply = textMsg?.trim();

            if (replyMap[userReply]) {
                await conn.sendMessage(fromUser, { react: { text: '✅', key: mekInfo.key } });
                await conn.sendMessage(fromUser, { text: replyMap[userReply] }, { quoted: mekInfo });
            } else {
                await conn.sendMessage(fromUser, { text: "❌ Invalid choice! Reply with 1-20" }, { quoted: mekInfo });
            }

            // Remove listener to prevent memory leak
            conn.ev.off('messages.upsert', listener);
        };

        conn.ev.on('messages.upsert', listener);

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *Main error:* ${error.message || "Error!"}`);
    }
});
