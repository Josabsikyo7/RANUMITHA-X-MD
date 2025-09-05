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
        // ---- First message: Hiruka sequence ----
        let hirukaMsg = await conn.sendMessage(from, { text: "Hiruka" }, { quoted: mek });

        const hirukaSteps = [
            { text: "Hiruka Ranumitha", delay: 500 },
            { text: "Hiruka Ranumitha de Silva", delay: 1000 }
        ];

        for (let step of hirukaSteps) {
            ((txt, d) => {
                setTimeout(async () => {
                    try {
                        await conn.sendMessage(from, { text: txt, edit: hirukaMsg.key });
                    } catch (err) {
                        await conn.sendMessage(from, { text: txt }, { quoted: mek });
                    }
                }, d);
            })(step.text, step.delay);
        }

        // ---- Second message: Kasun sequence ----
        setTimeout(async () => {
            let kasunMsg = await conn.sendMessage(from, { text: "Kasun" }, { quoted: mek });

            const kasunSteps = [
                { text: "Kasun Kalhara", delay: 500 },
                { text: "Kasun Kalhara de Silva", delay: 1000 }
            ];

            for (let step of kasunSteps) {
                ((txt, d) => {
                    setTimeout(async () => {
                        try {
                            await conn.sendMessage(from, { text: txt, edit: kasunMsg.key });
                        } catch (err) {
                            await conn.sendMessage(from, { text: txt }, { quoted: mek });
                        }
                    }, d);
                })(step.text, step.delay);
            }
        }, 5000); // start Kasun sequence after Hiruka sequence finishes

    } catch (e) {
        console.error("Error in nameeditseq command:", e);
        reply(`Error: ${e.message}`);
    }
});
