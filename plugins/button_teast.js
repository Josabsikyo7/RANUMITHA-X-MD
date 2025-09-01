const { cmd } = require('../command');

cmd({
  pattern: "btest",
  desc: "Show download menu",
  category: "menu",
  react: "📂",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const buttons = [
      { buttonId: 'apk', buttonText: { displayText: '📱 APK' }, type: 1 },
      { buttonId: 'ig', buttonText: { displayText: '📸 Instagram' }, type: 1 },
      { buttonId: 'fb', buttonText: { displayText: '📘 Facebook' }, type: 1 },
      { buttonId: 'tiktok', buttonText: { displayText: '🎶 TikTok' }, type: 1 },
      { buttonId: 'twitter', buttonText: { displayText: '🐦 Twitter' }, type: 1 },
    ];

    const buttonMessage = {
      text: "╭─『 📂 DOWNLOAD MENU 📂 』\n│\n├─ Choose an option below 👇",
      footer: "RANUMITHA-X-MD",
      buttons: buttons,
      headerType: 1
    };

    await conn.sendMessage(from, buttonMessage, { quoted: mek });
  } catch (e) {
    reply("❌ Error in sending menu!");
    console.log(e);
  }
});
