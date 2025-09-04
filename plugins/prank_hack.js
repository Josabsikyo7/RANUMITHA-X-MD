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
            const filled = Math.floor(percent / 10);
            const remainder = percent % 10;
            const empty = totalBlocks - filled - 1;
            let bar = "█".repeat(filled);
            if(filled < totalBlocks) bar += remainder > 0 ? "▒" : "";
            bar += "░".repeat(Math.max(0, empty));
            return `${bar} ${percent}%`;
        }

        // Key hacking phrases + suspense lines
        const phrases = {
            0: "💻 Hacking started...",
            5: "🔍 Scanning Data Center...",
            10:"⚠️ Suspicious activity detected...",
            15: "🛡️ Firewall breached",
            20: "🌐 Connecting to remote server...",
            25: "📁 Accessing database...",
            30: "⏳ Waiting for response...",
            35: "💾 Dumping sensitive data...",
            40: "✅ Database saved",
            45: "🚀 Uploading to control server...",
            50: "🖥️ Root access granted",
            60: "⚡ Power Override Enabled",
            70: "🧹 Cleaning logs and traces...",
            80: "🔒 Finalizing exploit...",
            90: "💣 Extracting critical files...",
            95: "🕵️ Data verification in progress...",
            100:"🚨 HACKING COMPLETE — TARGET COMPROMISED!"
        };

        // Generate 0 → 100% steps (1–2% increments)
        const steps = [];
        for(let i=0; i<=100; i+=2){
            let phrase = phrases[i] ? phrases[i] : "";
            // Random flickering effect
            let flicker = Math.random() > 0.7 ? "▒" : "";
            steps.push(`${phrase} ${makeBar(i)}${flicker}`.trim());
        }
        steps.push("🚨 HACKING COMPLETE — TARGET COMPROMISED!");

        // Send initial message
        let sentMsg = await conn.sendMessage(from, { text: steps[0] }, { quoted: mek });

        const baseDelay = 300; // ms between edits, adjust for speed
        for(let i=1; i<steps.length; i++){
            ((text, delay) => {
                setTimeout(async () => {
                    try {
                        await conn.sendMessage(from, {
                            text,
                            edit: sentMsg.key
                        });
                    } catch(err){
                        console.error("Failed to edit step:", err);
                    }
                }, delay);
            })(steps[i], i * baseDelay);
        }

    } catch(e) {
        console.error("Error in prankhack command:", e);
        reply(`Error: ${e.message}`);
    }
});
