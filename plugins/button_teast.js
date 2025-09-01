const { cmd } = require('../command');

cmd({
  pattern: "button",
  desc: "Show fancy bot menu with buttons",
  category: "system",
  react: "📂",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const buttons = [
      { buttonId: "apk", buttonText: { displayText: "📱 APK" }, type: 1 },
      { buttonId: "yt", buttonText: { displayText: "▶️ YouTube" }, type: 1 },
      { buttonId: "fb", buttonText: { displayText: "📘 Facebook" }, type: 1 },
      { buttonId: "fun", buttonText: { displayText: "🎮 Fun" }, type: 1 },
      { buttonId: "info", buttonText: { displayText: "ℹ️ Info" }, type: 1 }
    ];

    const buttonMessage = {
      text: "📂 *WELCOME TO DARK-KNIGHT MENU* 📂\n\nSelect an option below 👇",
      footer: "🛡 Dark-Knight MD",
      buttons: buttons,
      headerType: 1
    };

    await conn.sendMessage(from, buttonMessage, { quoted: mek });
  } catch (e) {
    console.log("❌ Error in menu:", e);
    await conn.sendMessage(from, { text: "⚠️ Something went wrong!" }, { quoted: mek });
  }
});
