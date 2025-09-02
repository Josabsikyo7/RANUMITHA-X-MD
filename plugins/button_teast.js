const { cmd } = require('../command');
const translate = require('@vitalets/google-translate-api');

let pendingTranslate = {};

const langMap = {
  "1": "si",
  "2": "en",
  "3": "hi",
  "4": "ta",
  "5": "ar",
  "6": "fr",
  "7": "de",
  "8": "ja",
  "9": "zh-cn",
  "10": "ru"
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

// Step 1: .translate command
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

  pendingTranslate[sender] = text;
  await conn.sendMessage(from, { text: langMenu }, { quoted: mek });
});

// Step 2: Handle reply
cmd({
  on: "text"
}, async (conn, mek, m, { from, sender }) => {
  const userChoice = m.text.trim();
  if (!pendingTranslate[sender]) return;

  const lang = langMap[userChoice];
  if (!lang) {
    return await conn.sendMessage(from, { 
      text: "❌ Invalid choice! Please reply with a number 1–10." 
    }, { quoted: mek });
  }

  const textToTranslate = pendingTranslate[sender];
  try {
    const res = await translate(textToTranslate, { to: lang });

    await conn.sendMessage(from, { 
      text: `✅ *Translated (${lang})*\n\n${res.text}` 
    }, { quoted: mek });

  } catch (error) {
    console.error("Translation Error:", error);
    await conn.sendMessage(from, { 
      text: "⚠️ Translation failed!\n\n
