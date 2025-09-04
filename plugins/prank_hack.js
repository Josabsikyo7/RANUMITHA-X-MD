const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "hack",
    alias: ["devicehack","fuckyourdevice", "fakehack","hacking"],
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

        // 20 separate messages
        const steps = [
            "💻 Hacking started...",
            makeBar(5),
            "🔍 Scanning Data Center...",
            makeBar(10),
            "🛡️ Firewall breached",
            makeBar(15),
            "🌐 Connecting to remote server...",
            makeBar(25),
            "📁 Accessing database...",
            makeBar(35),
            "💾 Dumping sensitive data...",
            makeBar(45),
            "✅ Database saved",
            makeBar(55),
            "📤 Uploading to control server...",
            makeBar(65),
            "🖥️ Root access granted",
            makeBar(75),
            "⚡ Power Override Enabled",
            makeBar(85),
            "🧹 Cleaning logs and traces...",
            makeBar(95),
            "🚨 HACKING COMPLETE — TARGET COMPROMISED!"
        ];

        const baseDelay = 900; // milliseconds between messages

        for (let i = 0; i < steps.length; i++) {
            ((text, delay) => {
                setTimeout(async () => {
                    try {
                        await conn.sendMessage(from, { text }, { quoted: mek });
                    } catch (err) {
                        console.error("Failed to send prank step:", err);
                    }
                }, delay);
            })(steps[i], i * baseDelay);
        }

    } catch (e) {
        console.error("Error in prankhack command:", e);
        reply(`Error: ${e.message}`);
    }
});
