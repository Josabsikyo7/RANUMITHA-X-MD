const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "envsettings",
    alias: ["env", "config"],
    desc: "Show bot configuration options",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        if (!isOwner) {
            await conn.sendMessage(from, { react: { text: "🚫", key: mek.key } });
            return reply("🚫 Only Owner can use this command!");
        }

        const text = mek.body?.trim();

        // Valid numbers
        const validNumbers = [
            "1.1","1.2","1.3","1.4",
            "2.1","2.2",
            "3.1","3.2",
            "4.1","4.2",
            "5.1","5.2",
            "6.1","6.2",
            "7.1","7.2",
            "8.1","8.2",
            "9.1","9.2",
            "10.1","10.2",
            "11.1","11.2",
            "12.1","12.2",
            "13.1","13.2",
            "14.1","14.2",
            "15.1","15.2",
            "16.1","16.2",
            "17.1","17.2",
            "18.1","18.2",
            "19.1","19.2",
            "20.1","20.2",
            "21.1","21.2"
        ];

        // Replies for each option
        const replies = {
            "1.1": "✅ Public Mode enabled",
            "1.2": "✅ Private Mode enabled",
            "1.3": "✅ Group Mode enabled",
            "1.4": "✅ Inbox Mode enabled",
            "2.1": "✅ Auto Recording ON",
            "2.2": "❌ Auto Recording OFF",
            "3.1": "✅ Auto Typing ON",
            "3.2": "❌ Auto Typing OFF",
            "4.1": "✅ Always Online ON",
            "4.2": "❌ Always Online OFF",
            "5.1": "✅ Public Mod ON",
            "5.2": "❌ Public Mod OFF",
            "6.1": "✅ Auto Voice ON",
            "6.2": "❌ Auto Voice OFF",
            "7.1": "✅ Auto Sticker ON",
            "7.2": "❌ Auto Sticker OFF",
            "8.1": "✅ Auto Reply ON",
            "8.2": "❌ Auto Reply OFF",
            "9.1": "✅ Auto React ON",
            "9.2": "❌ Auto React OFF",
            "10.1": "✅ Auto Status Seen ON",
            "10.2": "❌ Auto Status Seen OFF",
            "11.1": "✅ Auto Status Reply ON",
            "11.2": "❌ Auto Status Reply OFF",
            "12.1": "✅ Auto Status React ON",
            "12.2": "❌ Auto Status React OFF",
            "13.1": "✅ Custom React ON",
            "13.2": "❌ Custom React OFF",
            "14.1": "✅ Anti VV ON",
            "14.2": "❌ Anti VV OFF",
            "15.1": "✅ Welcome ON",
            "15.2": "❌ Welcome OFF",
            "16.1": "✅ Admin Events ON",
            "16.2": "❌ Admin Events OFF",
            "17.1": "✅ Anti Link ON",
            "17.2": "❌ Anti Link OFF",
            "18.1": "✅ Read Message ON",
            "18.2": "❌ Read Message OFF",
            "19.1": "✅ Anti Bad ON",
            "19.2": "❌ Anti Bad OFF",
            "20.1": "✅ Anti Link Kick ON",
            "20.2": "❌ Anti Link Kick OFF",
            "21.1": "✅ Read CMD ON",
            "21.2": "❌ Read CMD OFF"
        };

        if (validNumbers.includes(text)) {
            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            return reply(replies[text] || "⚙️ Option updated");
        }

    } catch (e) {
        console.error(e);
        reply("❌ Error while processing command!");
    }
});
