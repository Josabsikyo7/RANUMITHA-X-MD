const { cmd } = require('../command');

cmd({
  pattern: "download",
  desc: "Show download menu",
  category: "btest",
  react: "📂",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const templateButtons = [
      { index: 1, quickReplyButton: { displayText: "📱 APK", id: "apk" } },
      { index: 2, quickReplyButton: { displayText: "📸 Instagram", id: "ig" } },
      { index: 3, quickReplyButton: { displayText: "📘 Facebook", id: "fb" } },
      { index: 4, quickReplyButton: { displayText: "🎶 TikTok", id: "tiktok" } },
      { index: 5, quickReplyButton: { displayText: "🐦 Twitter", id: "twitter" } }
    ];

    const templateMessage = {
      text: "╭─『 📂 DOWNLOAD MENU 📂 』\n│\n├─ Choose an option below 👇",
      footer: "RANUMITHA-X-MD",
      templateButtons: templateButtons
    };

    await conn.sendMessage(from, templateMessage, { quoted: mek });
  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: "❌ Error in sending menu!" }, { quoted: mek });
  }
});
