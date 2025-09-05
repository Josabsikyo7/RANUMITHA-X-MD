const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "loard",
    alias: ["hackprank", "fakehack"],
    use: '.prankhack',
    desc: "Prank hacking simulation with loading bar.",
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

        // Hacking phrases to show at certain percentages
        const phrases = {
            5: "💻 Initializing hack system...",
            15: "🔍 Scanning open ports...",
            25: "🛡️ Firewall bypassed...",
            35: "📂 Accessing database...",
            50: "💾 Dumping data...",
            65: "📡 Uploading to control server...",
            75: "⚡ Power override engaged...",
            85: "🧹 Cleaning traces...",
            95: "🚨 Finalizing exploit...",
            100: "✅ HACKING COMPLETE — TARGET COMPROMISED!"
        };

        // Initial bar
        let sentMsg = await conn.sendMessage(from, { text: makeBar(0) }, { quoted: mek });

        const totalSteps = 100;   // 1% to 100
        const delay = 300;        // ms per step

        for (let i = 1; i <= totalSteps; i++) {
            ((p) => {
                setTimeout(async () => {
                    try {
                        let text = makeBar(p);
                        if (phrases[p]) {
                            text = phrases[p] + "\n" + text; // attach phrase with bar
                        }

                        // Try to edit the same message
                        await conn.sendMessage(from, {
                            text,
                            edit: sentMsg.key
                        });
                    } catch (err) {
                        // fallback: send as new message if edit unsupported
                        await conn.sendMessage(from, { text: makeBar(p) }, { quoted: mek });
                    }
                }, p * delay);
            })(i);
        }

    } catch (e) {
        console.error("Error in prankhack command:", e);
        reply(`Error: ${e.message}`);
    }
});
