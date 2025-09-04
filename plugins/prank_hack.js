const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "hack",
    alias: ["hackprank", "fakehack"],
    use: '.prankhack',
    desc: "Prank hacking simulation (harmless).",
    category: "fun",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Smooth flickering progress bar
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

        // Hacking phrases at key points
        const phrases = {
            0: "💻 Hacking started...",
            5: "🔍 Scanning Data Center...",
            15: "🛡️ Firewall breached",
            25: "🌐 Connecting to remote server...",
            35: "📁 Accessing database...",
            45: "💾 Dumping sensitive data...",
            55: "✅ Database saved",
            65: "📤 Uploading to control server...",
            75: "🖥️ Root access granted",
            85: "⚡ Power Override Enabled",
            95: "🧹 Cleaning logs and traces...",
            100:"🚨 HACKING COMPLETE — TARGET COMPROMISED!"
        };

        // Generate steps 0 → 100% by 2% increments
        const steps = [];
        for(let i=0; i<=100; i+=2){
            if(phrases[i]) steps.push(`${phrases[i]} ${makeBar(i)}`);
            else steps.push(makeBar(i));
        }

        // Send initial message
        let sentMsg = await conn.sendMessage(from, { text: steps[0] }, { quoted: mek });

        const baseDelay = 350; // adjust speed: lower = faster
        for(let i=1; i<steps.length; i++){
            ((text, delay) => {
                setTimeout(async () => {
                    try {
                        await conn.sendMessage(from, {
                            text,
                            edit: sentMsg.key
                        });
                    } catch(err){
                        console.error("Failed to edit prank step:", err);
                    }
                }, delay);
            })(steps[i], i * baseDelay);
        }

    } catch(e) {
        console.error("Error in prankhack command:", e);
        reply(`Error: ${e.message}`);
    }
});
