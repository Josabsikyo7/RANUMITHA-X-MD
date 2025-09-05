const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "prankhack",
    alias: ["hackprank", "fakehack"],
    use: '.prankhack',
    desc: "Prank hacking simulation (20-step messages).",
    category: "fun",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        function makeBar(percent) {
            const totalBlocks = 20; // bar size
            const filled = Math.floor((percent / 100) * totalBlocks);
            const empty = totalBlocks - filled;
            return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent}% ⏳`;
        }

        const steps = [
            { p: 0,   msg: "👨‍💻 Hacking started..." },
            { p: 5,   msg: "🔍 Scanning open ports..." },
            { p: 10,  msg: "🛡️ Firewall bypassed..." },
            { p: 15,  msg: "🌐 Connecting to server..." },
            { p: 20,  msg: "📂 Accessing database..." },
            { p: 30,  msg: "💾 Dumping data..." },
            { p: 40,  msg: "📡 Uploading payload..." },
            { p: 50,  msg: "⚡ Privilege escalation..." },
            { p: 60,  msg: "🖥️ Root access granted..." },
            { p: 70,  msg: "🔒 Encrypting channels..." },
            { p: 80,  msg: "🧹 Cleaning traces..." },
            { p: 90,  msg: "🚨 Finalizing exploit..." },
            { p: 100, msg: "✅ HACKING COMPLETE — TARGET COMPROMISED!" }
        ];

        const baseDelay = 1000; // ms between messages

        for (let i = 0; i < steps.length; i++) {
            ((step, delay) => {
                setTimeout(async () => {
                    try {
                        const text = `${step.msg}\n${makeBar(step.p)}`;
                        await conn.sendMessage(from, { text }, { quoted: mek });
                    } catch (err) {
                        console.error("Send error:", err);
                    }
                }, delay);
            })(steps[i], i * baseDelay);
        }

    } catch (e) {
        console.error("Error in prankhack command:", e);
        reply(`Error: ${e.message}`);
    }
});
