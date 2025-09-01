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
        if (!text) return await reply("❌ Please send your phone number e.g., 071XXXXXXX");

        let number = text.trim();

        // Auto convert local 0XXXXXXX to +94XXXXXXXXX
        if (/^0\d{9}$/.test(number)) {
            number = "+94" + number.slice(1);
        }

        // Only allow +94 numbers now
        if (!/^\+94\d{9}$/.test(number)) {
            return await reply("❌ Invalid number! Only Sri Lanka numbers allowed.");
        }

        // Send request to site
        const response = await axios.post(
            "https://visper-md-offical.vercel.app/api/pair",
            { phone: number },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const { code, expiresIn } = response.data;

        // send code to user
        await reply(`✅ Your pairing code: ${code}\nExpires in: ${expiresIn} seconds`);

        // react ✅
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (err) {
        console.error(err);
        await reply(`❌ Error: ${err.response?.statusText || err.message || "Something went wrong!"}`);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});
