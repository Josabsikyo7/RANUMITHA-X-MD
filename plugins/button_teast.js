const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    desc: "Generate pairing code for your number",
    category: "system",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return await reply("❌ Please send your phone number e.g., +9400000000");

        const number = text.trim();
        if (!/^\+94\d{9}$/.test(number)) {
            return await reply("❌ Invalid number format! Use +94XXXXXXXXX");
        }

        // send request to site to generate code
        const response = await axios.post("https://visper-md-offical.vercel.app/pair", {
            phone: number
        });

        const { code, expiresIn } = response.data; // site returns { code: "ABC123", expiresIn: 60 }

        // send code to user
        await reply(`✅ Your pairing code: ${code}\nExpires in: ${expiresIn} seconds`);

        // react ✅
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (err) {
        await reply(`❌ Error: ${err.message || "Something went wrong!"}`);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});
