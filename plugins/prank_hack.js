const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "nameedit",
    alias: ["hirukaedit"],
    use: '.nameedit',
    desc: "Sequential text edit: Hiruka → Hiruka Ranumitha → Hiruka Ranumitha de Silva",
    category: "fun",
    react: "✍️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Step 1: send first message
        let sentMsg = await conn.sendMessage(from, { text: "Hiruka" }, { quoted: mek });

        // Step 2: edit after 2s → Hiruka Ranumitha
        setTimeout(async () => {
            try {
                await conn.sendMessage(from, {
                    text: "Hiruka Ranumitha",
                    edit: sentMsg.key
                });
            } catch (err) {
                await conn.sendMessage(from, { text: "Hiruka Ranumitha" }, { quoted: mek });
            }
        }, 2000);

        // Step 3: edit after 4s → Hiruka Ranumitha de Silva
        setTimeout(async () => {
            try {
                await conn.sendMessage(from, {
                    text: "Hiruka Ranumitha de Silva",
                    edit: sentMsg.key
                });
            } catch (err) {
                await conn.sendMessage(from, { text: "Hiruka Ranumitha de Silva" }, { quoted: mek });
            }
        }, 4000);

    } catch (e) {
        console.error("Error in nameedit command:", e);
        reply(`Error: ${e.message}`);
    }
});
