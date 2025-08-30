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

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
        

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
                
                if (userReply === "1") {
                    msg = await conn.sendMessage(from, { text: "Hodai" }, { quoted: mek });
                    ;
                    
                } else if (userReply === "2") {
                    msg = await conn.sendMessage(from, { text: "aulak na" }, { quoted: mek });
                    
                    
                } else { 
                    return await reply("❌ Invalid choice! Reply with 1 or 2");
                

                

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
    }
});
