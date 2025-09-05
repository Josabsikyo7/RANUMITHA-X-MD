const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "prankhack",
    alias: ["hackprank", "fakehack"],
    use: '.prankhack',
    desc: "Prank hacking simulation (extended ~28-step messages).",
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

        const steps = [
            { p: 0,   msg: "👨‍💻 Hacking started..." },
            { p: 3,   msg: "🔍 Initializing attack vectors..." },
            { p: 5,   msg: "📡 Scanning open ports..." },
            { p: 8,   msg: "🛰️ Mapping target network..." },
            { p: 10,  msg: "🛡️ Firewall bypassed..." },
            { p: 12,  msg: "🔑 Cracking SSH keys..." },
            { p: 15,  msg: "🌐 Connecting to server..." },
            { p: 18,  msg: "📂 Accessing database..." },
            { p: 20,  msg: "💽 Extracting user tables..." },
            { p: 25,  msg: "📊 Reading sensitive data..." },
            { p: 30,  msg: "💾 Dumping database..." },
            { p: 35,  msg: "📡 Uploading payload..." },
            { p: 40,  msg: "⚡ Privilege escalation..." },
            { p: 45,  msg: "🖥️ Root access granted..." },
            { p: 50,  msg: "📂 Accessing data center..." },
            { p: 55,  msg: "🔓 Decrypting secure files..." },
            { p: 60,  msg: "🔒 Encrypting stolen archive..." },
            { p: 65,  msg: "📦 Packing exfiltrated files..." },
            { p: 70,  msg: "📡 Uploading to remote server..." },
            { p: 75,  msg: "📶 Signal boosted for stealth transfer..." },
            { p: 80,  msg: "🧹 Cleaning local traces..." },
            { p: 85,  msg: "📀 Formatting system logs..." },
            { p: 88,  msg: "🔄 Spoofing IP address..." },
            { p: 90,  msg: "🚨 Finalizing exploit..." },
            { p: 93,  msg: "📂 Seeding fake backups..." },
            { p: 96,  msg: "🛰️ Bypassing monitoring tools..." },
            { p: 98,  msg: "🛑 Disconnecting secure channels..." },
            { p: 100, msg: "✅ HACKING COMPLETE — TARGET COMPROMISED!" }
        ];

        const baseDelay = 1000; // ms

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
