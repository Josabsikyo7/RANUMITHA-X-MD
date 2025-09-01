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
        const info = `╭─『 ⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 𝗠𝗘𝗡𝗨 ⚙️ 』───❏\n...`; // truncated for brevity

        const image = "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/IMG-20250711-WA0010.jpg";
        const audioUrl = "https://github.com/Ranumithaofc/RANU-FILE-S-/raw/refs/heads/main/Audio/menujs-audio.mp3";

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: fakevCard });
        const messageID = sentMsg.key.id;

        await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });

        // listen once for reply to this menu
        const listener = async (msgUpdate) => {
            const mekInfo = msgUpdate?.messages[0];
            if (!mekInfo?.message) return;

            const fromUser = mekInfo.key.remoteJid;
            const textMsg = mekInfo.message.conversation || mekInfo.message.extendedTextMessage?.text;
            const quotedId = mekInfo.message?.extendedTextMessage?.contextInfo?.stanzaId;

            if (quotedId !== messageID) return;

            const userReply = textMsg?.trim();

            if (/^(1\.1|1\.2|1\.3|1\.4|2\.1|2\.2|3\.1|3\.2|4\.1|4\.2|5\.1|5\.2|6\.1|6\.2|7\.1|7\.2|8\.1|8\.2|9\.1|9\.2|10\.1|10\.2|11\.1|11\.2|12\.1|12\.2|13\.1|13\.2|14\.1|14\.2|15\.1|15\.2|16\.1|16\.2|17\.1|17\.2|18\.1|18\.2|19\.1|19\.2|20\.1|20\.2)$/.test(userReply)) {
                await conn.sendMessage(fromUser, { react: { text: '✅', key: mekInfo.key } });

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

                await reply(replyMap[userReply] || "❌ Invalid choice!");
            } else {
                await conn.sendMessage(fromUser, { text: "❌ Invalid choice! Reply with 1-20" }, { quoted: mekInfo });
            }

            // Remove listener after first valid reply
            conn.ev.off('messages.upsert', listener);
        };

        conn.ev.on('messages.upsert', listener);

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *Main error:* ${error.message || "Error!"}`);
    }
});
