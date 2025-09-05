const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "loadingbar",
    alias: ["bar", "progress"],
    use: '.loadingbar',
    desc: "Fake loading bar with edits",
    category: "fun",
    react: "⏳",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        function makeBar(percent) {
            const totalBlocks = 20; // full bar size
            const filled = Math.floor((percent / 100) * totalBlocks);
            const empty = totalBlocks - filled;
            return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent}% ⏳`;
        }

        // Initial message
        let sentMsg = await conn.sendMessage(from, { text: makeBar(0) }, { quoted: mek });

        const totalSteps = 100;   // 1% to 100%
        const delay = 300;        // ms between updates

        for (let i = 1; i <= totalSteps; i++) {
            ((p) => {
                setTimeout(async () => {
                    try {
                        // Edit the same message with new percentage
                        await conn.sendMessage(from, {
                            text: makeBar(p),
                            edit: sentMsg.key
                        });
                    } catch (err) {
                        // fallback: send new message if edit not supported
                        await conn.sendMessage(from, { text: makeBar(p) }, { quoted: mek });
                    }
                }, p * delay);
            })(i);
        }

    } catch (e) {
        console.error("Error in loadingbar command:", e);
        reply(`Error: ${e.message}`);
    }
});
