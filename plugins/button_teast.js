const { cmd } = require('../command');
const translate = require('@vitalets/google-translate-api');

let pendingTranslate = {};

const langMap = {
  "1": { code: "si", name: "Sinhala" },
  "2": { code: "en", name: "English" },
  "3": { code: "hi", name: "Hindi" },
  "4": { code: "ta", name: "Tamil" },
  "5": { code: "ar", name: "Arabic" },
  "6": { code: "fr", name: "French" },
  "7": { code: "de", name: "German" },
  "8": { code: "ja", name: "Japanese" },
  "9": { code: "zh-cn", name: "Chinese" },
  "10": { code: "ru", name: "Russian" }
};

const langMenu = `
🌍 *Select Language Number to Translate:*

1. 🇱🇰 Sinhala
2. 🇬🇧 English
3. 🇮🇳 Hindi
4. 🇱🇰 Tamil
5. 🇸🇦 Arabic
6. 🇫🇷 French
7. 🇩🇪 German
8. 🇯🇵 Japanese
9. 🇨🇳 Chinese
10. 🇷🇺 Russian

👉 Reply with number (1–10) after typing your text.
`;

// Step 1: translate command
cmd({
  pattern: "translate",
  desc: "Translate text to selected language",
  category: "tools",
  react: "🌍",
  filename: __filename
}, async (conn, mek, m, { from, sender }) => {
  const text = m.text.trim().split(" ").slice(1).join(" ");
  if (!text) {
    return await conn.sendMessage(from, { 
      text: "✍️ Please enter text to translate.\n\nExample: *.translate Hello world*" 
    }, { quoted: mek });
  }

  // save original text for user
  pendingTranslate[sender] = text;

  await conn.sendMessage(from, { text: langMenu }, { quoted: mek });
});

// Step 2: listen to reply
cmd({
  on: "text"
}, async (conn, mek, m, { from, sender }) => {
  if (!pendingTranslate[sender]) return;

  const choice = m.text.trim();
  const lang = langMap[choice];
  if (!lang) {
    return await conn.sendMessage(from, { 
      text: "❌ Invalid choice! Please reply with number (1–10)." 
    }, { quoted: mek });
  }

  const textToTranslate = pendingTranslate[sender];
  delete pendingTranslate[sender]; // clear session

  try {
    const res = await translate(textToTranslate, { to: lang.code });

    // ✅ send translated text to user
    await conn.sendMessage(from, { 
      text: `✅ *Translated to ${lang.name} (${lang.code})*\n\n${res.text}` 
    }, { quoted: mek });

  } catch (err) {
    console.error("Translation Error:", err);
    await conn.sendMessage(from, { 
      text: "⚠️ Translation failed!\n\n" + err.message 
    }, { quoted: mek });
  }
});
