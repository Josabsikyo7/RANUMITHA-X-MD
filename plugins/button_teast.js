const config = require('../config');
const { cmd } = require('../command');

// === All Users Can Use ===
cmd({
    pattern: "btest",
    alias: ["mytest", "button"],
    desc: "Show bot configuration options",
    category: "butoons",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // ✅ Step 1: Send Language Selection Menu
        const templateButtons = [
            { index: 1, quickReplyButton: { displayText: "English", id: "lang_en" } },
            { index: 2, quickReplyButton: { displayText: "සිංහල", id: "lang_si" } },
            { index: 3, quickReplyButton: { displayText: "தமிழ்", id: "lang_ta" } }
        ];

        await conn.sendMessage(from, {
            text: "🌐 Please select your language:",
            footer: "Bot Settings",
            templateButtons
        }, { quoted: mek });

        // === Listen for replies ===
        conn.ev.on("messages.upsert", async (event) => {
            const msg = event.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            // ✅ Handle Language Selection
            if (msg.message?.templateButtonReplyMessage) {
                const langId = msg.message.templateButtonReplyMessage.selectedId;

                if (langId === "lang_en") {
                    await conn.sendMessage(from, { text: "✅ Language set to English" }, { quoted: mek });
                    sendHelpMenu(conn, from, mek);
                }
                if (langId === "lang_si") {
                    await conn.sendMessage(from, { text: "✅ භාෂාව සිංහලට සකසා ඇත" }, { quoted: mek });
                    sendHelpMenu(conn, from, mek);
                }
                if (langId === "lang_ta") {
                    await conn.sendMessage(from, { text: "✅ மொழி தமிழில் அமைக்கப்பட்டுள்ளது" }, { quoted: mek });
                    sendHelpMenu(conn, from, mek);
                }
            }

            // ✅ Handle Help Menu Selections
            if (msg.message?.listResponseMessage) {
                const optionId = msg.message.listResponseMessage.singleSelectReply.selectedRowId;

                if (optionId === "help_data") {
                    await conn.sendMessage(from, { text: "📱 You selected Data Packages" }, { quoted: mek });
                }
                if (optionId === "help_calls") {
                    await conn.sendMessage(from, { text: "📞 You selected Call Packages" }, { quoted: mek });
                }
                if (optionId === "help_balance") {
                    await conn.sendMessage(from, { text: "💳 You selected Balance Inquiry" }, { quoted: mek });
                }
                if (optionId === "help_settings") {
                    await conn.sendMessage(from, { text: "⚙️ You selected Settings" }, { quoted: mek });
                }
            }
        });

    } catch (e) {
        console.log("❌ Error in envsettings:", e);
        await reply("⚠️ Something went wrong!");
    }
});

// === Helper Function: Send Help Menu ===
async function sendHelpMenu(conn, from, mek) {
    const sections = [
        {
            title: "📌 Select an Option",
            rows: [
                { title: "📱 Data Packages", rowId: "help_data" },
                { title: "📞 Call Packages", rowId: "help_calls" },
                { title: "💳 Balance Inquiry", rowId: "help_balance" },
                { title: "⚙️ Settings", rowId: "help_settings" }
            ]
        }
    ];

    await conn.sendMessage(from, {
        text: "Please select the area you need help with 👇",
        footer: "Bot Settings",
        title: "Help Menu",
        buttonText: "📋 Click here",
        sections
    }, { quoted: mek });
}
