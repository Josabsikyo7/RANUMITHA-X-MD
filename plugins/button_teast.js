const { cmd } = require('../command');

cmd({
  pattern: "bab",
  desc: "Show bot menu (Stable Buttons)",
  category: "system",
  react: "📂",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const buttons = [
      { buttonId: "apk", buttonText: { displayText: "📱 APK" }, type: 1 },
      { buttonId: "yt", buttonText: { displayText: "▶️ YouTube" }, type: 1 },
      { buttonId: "fb", buttonText: { displayText: "📘 Facebook" }, type: 1 }
    ];

    const buttonMessage = {
      contentText: "📂 DOWNLOAD MENU\n\nSelect an option below 👇",
      footerText: "Dark-Knight MD",
      buttons: buttons,
      headerType: 1
    };

    await conn.sendMessage(from, buttonMessage, MessageType.buttonsMessage, { quoted: mek });
  } catch (e) {
    console.log("❌ Error in menu:", e);
    await conn.sendMessage(from, { text: "⚠️ Something went wrong!" }, { quoted: mek });
  }
});
