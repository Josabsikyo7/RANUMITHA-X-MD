const { cmd } = require('../command');
const translate = require('@iamtraction/google-translate');

// ==============================
// Pending translations memory
// ==============================
let pendingTranslate = {};

// ==============================
// Language map
// ==============================
const langMap = {
  "1": "si",       // Sinhala
  "2": "en",       // English
  "3": "hi",       // Hindi
  "4": "ta",       // Tamil
  "5": "ar",       // Arabic
  "6": "fr",       // French
  "7": "de",       // German
  "8": "ja",       // Japanese
  "9": "zh-cn",    // Chinese
  "10": "ru"       // Russian
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

// ==============================
// Step 1: .translate command
// ==============================
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

  // Save user pending translation
  pendingTranslate[sender] = text;

  // Send language menu
  await conn.sendMessage(from, { text: langMenu }, { quoted: mek });
});

// ==============================
// Step 2: Handle language number reply
// ==============================
cmd({
  on: "text"
}, async (conn, mek, m, { from, sender }) => {
  const userChoice = m.text.trim();

  // Check if user has pending translation
  if (!pendingTranslate[sender]) return;

  const lang = langMap[userChoice];
  if (!lang) {
    return await conn.sendMessage(from, { 
      text: "❌ Invalid choice! Please reply with a number 1–10." 
    }, { quoted: mek });
  }

  const textToTranslate = pendingTranslate[sender];

  try {
    // Translate text
    const res = await translate(textToTranslate, { to: lang });

    // Send translated text
    await conn.sendMessage(from, { 
      text: `✅ *Translated (${lang})*\n\n${res.text}` 
    }, { quoted: mek });

  } catch (error) {
    console.error("Translation Error:", error);
    await conn.sendMessage(from, { 
      text: "⚠️ Translation failed!\n\n" + error.message 
    }, { quoted: mek });
  }

  // Clear pending translation for this user
  delete pendingTranslate[sender];
});
