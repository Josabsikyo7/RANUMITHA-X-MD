const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "prankhack",
    alias: ["hackprank", "fakehack"],
    use: '.prankhack',
    desc: "Prank hacking simulation (harmless).",
    category: "fun",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        function makeBar(percent) {
            const totalBlocks = 10;
            const filled = Math.round((percent / 100) * totalBlocks);
            const empty = totalBlocks - filled;
            return "█".repeat(filled) + "░".repeat(empty) + ` ${percent}%`;
        }

        const steps = [
            "💻 Hacking started...",
            makeBar(0),
            makeBar(5),
            "🔍 Scanning Data Center...",
            makeBar(10),
            "🛡️ Firewall breached",
            makeBar(20),
            "🌐 Connecting to remote server...",
            makeBar(30),
            "📁 Accessing database...",
            makeBar(40),
            "💾 Dumping sensitive data...",
            makeBar(50),
            "✅ Database saved",
            makeBar(60),
            "📤 Uploading to control server...",
            makeBar(70),
            "🖥️ Root access granted",
            makeBar(75),
            "⚡ Power Override Enabled",
            makeBar(80),
            "🧹 Cleaning logs and traces...",
            makeBar(90),
            "🔒 Finalizing exploit...",
            makeBar(95),
            makeBar(100),
            "🚨 HACKING COMPLETE — TARGET COMPROMISED!"
        ];

        // Send initial message
        let sentMsg = await conn.sendMessage(from, { text: steps[0] }, { quoted: mek });

        const baseDelay = 900; // milliseconds between edits

        for (let i = 1; i < steps.length; i++) {
            ((text, delay) => {
                setTimeout(async () => {
                    try {
                        await conn.sendMessage(from, {
                            text,
                            edit: sentMsg.key
                        });
                    } catch (err) {
                        console.error("Failed to edit prank step:", err);
                    }
                }, delay);
            })(steps[i], i * baseDelay);
        }

    } catch (e) {
        console.error("Error in prankhack command:", e);
        reply(`Error: ${e.message}`);
    }
});
