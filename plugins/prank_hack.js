const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "hack2",
    alias: ["hackprank2", "fakehack2"],
    use: '.prankhack',
    desc: "Prank hacking simulation (harmless).",
    category: "fun",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        function makeBar(percent) {
            const totalBlocks = 20;
            const filled = Math.floor((percent / 100) * totalBlocks);
            const empty = totalBlocks - filled;
            return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent}% ⏳`;
        }

        // 20 separate messages → calculate percentage per message
        const totalMessages = 20;
        const steps = [];
        const keyPhrases = {
            0: "💻 Hacking started...",
            5: "🔍 Scanning Data Center...",
            10: "🛡️ Firewall breached",
            15: "🌐 Connecting to remote server...",
            20: "📁 Accessing database...",
            25: "💾 Dumping sensitive data...",
            30: "✅ Database saved",
            35: "📤 Uploading to control server...",
            40: "🖥️ Root access granted",
            45: "⚡ Power Override Enabled",
            50: "🧹 Cleaning logs and traces...",
            55: "🔒 Finalizing exploit...",
            60: "🚨 HACKING COMPLETE — TARGET COMPROMISED!"
        };

        for (let i = 0; i < totalMessages; i++) {
            let percent = Math.floor((i / (totalMessages - 1)) * 100);
            let phrase = keyPhrases[percent] ? keyPhrases[percent] + " " : "";
            steps.push(`${phrase}${makeBar(percent)}`);
        }

        // Send messages sequentially
        const baseDelay = 700;
        for (let i = 0; i < steps.length; i++) {
            ((text, delay) => {
                setTimeout(async () => {
                    try {
                        await conn.sendMessage(from, { text }, { quoted: mek });
                    } catch (err) {
                        console.error("Failed to send step:", err);
                    }
                }, delay);
            })(steps[i], i * baseDelay);
        }

    } catch (e) {
        console.error("Error in prankhack command:", e);
        reply(`Error: ${e.message}`);
    }
});
