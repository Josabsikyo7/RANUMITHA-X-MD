const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "nameedit",
    alias: ["nameeditseq"],
    use: '.nameedit',
    desc: "Sequential text edit: Hiruka & Kasun",
    category: "fun",
    react: "✍️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Initial message
        let sentMsg = await conn.sendMessage(from, { text: "Hiruka" }, { quoted: mek });

        // Timeline for edits
        const steps = [
            { text: "Hiruka Ranumitha", delay: 1000 },
            { text: "Hiruka Ranumitha de Silva", delay: 2000 },
            { text: "Kasun", delay: 3000 },
            { text: "Kasun Kalhara", delay: 4000 },
            { text: "Kasun Kalhara de Silva", delay: 5000 }
        ];

        // Sequential edits
        for (let step of steps) {
            ((txt, d) => {
                setTimeout(async () => {
                    try {
                        await conn.sendMessage(from, {
                            text: txt,
                            edit: sentMsg.key
                        });
                    } catch (err) {
                        await conn.sendMessage(from, { text: txt }, { quoted: mek });
                    }
                }, d);
            })(step.text, step.delay);
        }

    } catch (e) {
        console.error("Error in nameeditseq command:", e);
        reply(`Error: ${e.message}`);
    }
});
