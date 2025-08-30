const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "test",
    alias: ["test1"],
    react: "🇱🇰",
    desc: "my cmd",
    category: "download",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        const info = `Hello yaluwe`;
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
        conn.ev.on('messages.upsert', async (messageUpdate) => {
            try {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message) return;

                const messageType =
                    mekInfo?.message?.conversation ||
                    mekInfo?.message?.extendedTextMessage?.text;

                const isReplyToSentMsg =
                    mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToSentMsg) return;

                let userReply = messageType.trim();

                if (userReply === "1") {
                    await conn.sendMessage(from, { text: "Hodai" }, { quoted: mek });
                } else if (userReply === "2") {
                    await conn.sendMessage(from, { text: "aulak na" }, { quoted: mek });
                } else {
                    return await reply("❌ Invalid choice! Reply with 1 or 2");
                }
            } catch (error) {
                console.error(error);
                await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
                await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
            }
        });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *Main error:* ${error.message || "Error!"}`);
    }
});
