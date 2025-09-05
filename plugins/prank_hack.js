const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "khack",
    alias: ["khackyou", "khackingyourdevice","kfuckyourdevice","khardfuck"],
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
            { text: "Kasun Kalhara de Silva", delay: 5000 },
                        { text: "Kasun", delay: 6000 },
            { text: "Kasun Kalhara", delay: 7000 },
            { text: "Kasun Kalhara de Silva", delay: 8000 },            { text: "Kasun", delay: 9000 },
            { text: "Kasun Kalhara", delay: 10000 },
            { text: "Kasun Kalhara de Silva", delay: 11000 },            { text: "Kasun", delay: 12000 },
            { text: "Kasun Kalhara", delay: 13000 },
            { text: "Kasun Kalhara de Silva", delay: 14000 },            { text: "Kasun", delay: 15000 },
            { text: "Kasun Kalhara", delay: 16000 },
            { text: "Kasun Kalhara de Silva", delay: 17000 },            { text: "Kasun", delay: 18000 },
            { text: "Kasun Kalhara", delay: 19000 },
            { text: "Kasun Kalhara de Silva", delay: 20000 },            { text: "Kasun", delay: 21000 },
            { text: "Kasun Kalhara", delay: 22000 },
            { text: "Kasun Kalhara de Silva", delay: 23000 },            { text: "Kasun", delay: 24000 },
            { text: "Kasun Kalhara", delay: 25000 },
            { text: "Kasun Kalhara de Silva", delay: 26000 },            { text: "Kasun", delay: 27000 },
            { text: "Kasun Kalhara", delay: 28000 },
            { text: "Kasun Kalhara de Silva", delay: 29000 },            { text: "Kasun", delay: 30000 },
            { text: "Kasun Kalhara", delay: 31000 },
            { text: "Kasun Kalhara de Silva", delay: 32000 },            { text: "Kasun", delay: 33000 },
            { text: "Kasun Kalhara", delay: 34000 },
            { text: "Kasun Kalhara de Silva", delay: 35000 },            { text: "Kasun", delay: 36000 },
            { text: "Kasun Kalhara", delay: 37000 },
            { text: "Kasun Kalhara de Silva", delay: 38000 },            { text: "Kasun", delay: 39000 },
            { text: "Kasun Kalhara", delay: 40000 },
            { text: "Kasun Kalhara de Silva", delay: 41000 },            { text: "Kasun", delay: 42000 },
            { text: "Kasun Kalhara", delay: 43000 },
            { text: "Kasun Kalhara de Silva", delay: 44000 },            { text: "Kasun", delay: 45000 },
            { text: "Kasun Kalhara", delay: 46000 },
            { text: "Kasun Kalhara de Silva", delay: 47000 },            { text: "Kasun", delay: 48000 },
            { text: "Kasun Kalhara", delay: 49000 },
            { text: "Kasun Kalhara de Silva", delay: 50000 },            { text: "Kasun", delay: 51000 },
            { text: "Kasun Kalhara", delay: 52000 },
            { text: "Kasun Kalhara de Silva", delay: 53000 },            { text: "Kasun", delay: 54000 },
            { text: "Kasun Kalhara", delay: 55000 },
            { text: "Kasun Kalhara de Silva", delay: 56000 }
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
