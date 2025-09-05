const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "nameedit",
    alias: ["nameeditseq"],
    use: '.nameedit',
    desc: "Sequential text edit: Hiruka & Kasun separate messages",
    category: "fun",
    react: "✍️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // ---- Hiruka sequence ----
        let hirukaMsg = await conn.sendMessage(from, { text: "Hiruka" }, { quoted: mek });
        const hirukaSteps = ["Hiruka Ranumitha", "Hiruka Ranumitha de Silva"];
        for (let i = 0; i < hirukaSteps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // delay 2s
            try {
                await conn.sendMessage(from, { text: hirukaSteps[i], edit: hirukaMsg.key });
            } catch {
                await conn.sendMessage(from, { text: hirukaSteps[i] }, { quoted: mek });
            }
        }

        // ---- Kasun sequence ----
        let kasunMsg = await conn.sendMessage(from, { text: "Kasun" }, { quoted: mek });
        const kasunSteps = ["Kasun Kalhara", "Kasun Kalhara de Silva"];
        for (let i = 0; i < kasunSteps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // delay 2s
            try {
                await conn.sendMessage(from, { text: kasunSteps[i], edit: kasunMsg.key });
            } catch {
                await conn.sendMessage(from, { text: kasunSteps[i] }, { quoted: mek });
            }
        }

    } catch (e) {
        console.error("Error in nameeditseq command:", e);
        reply(`Error: ${e.message}`);
    }
});
