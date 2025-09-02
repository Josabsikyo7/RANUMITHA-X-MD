const { cmd } = require('../command');
const translate = require('@iamtraction/google-translate');

// භාෂා menu එක
const langMenu = `
🌍 *Select Language Number to Translate:*

1. 🇱🇰 Sinhala (si)
2. 🇬🇧 English (en)
3. 🇮🇳 Hindi (hi)
4. 🇪🇸 Spanish (es)
5. 🇫🇷 French (fr)
6. 🇩🇪 German (de)
7. 🇯🇵 Japanese (ja)
8. 🇨🇳 Chinese (zh-cn)

👉 Reply with number (e.g. 1) after typing your text.
`;

// user data save කරන්න memory object
let pendingTranslate = {};

cmd({
    pattern: "translate",
    desc: "Translate text to selected language",
    category: "tools",
    react: "🌍",
    filename: __filename
}, async (conn, mek, m, { from, sender }) => {
    const text = m.text.trim().split(" ").slice(1).join(" ");
    if (!text) {
        return await conn.sendMessage(from, { text: "✍️ Please enter text to translate.\n\nExample: *.translate Hello world*" }, { quoted: mek });
    }

    // save user input
    pendingTranslate[sender] = text;

    await conn.sendMessage(from, { text: langMenu }, { quoted: mek });
});

// Number reply handler
cmd({
    on: "text"
}, async (conn, mek, m, { from, sender }) => {
    const text = m.text.trim();

    // if user has pending translation
    if (pendingTranslate[sender]) {
        let lang = null;

        switch (text) {
            case "1": lang = "si"; break;
            case "2": lang = "en"; break;
            case "3": lang = "hi"; break;
            case "4": lang = "es"; break;
            case "5": lang = "fr"; break;
            case "6": lang = "de"; break;
            case "7": lang = "ja"; break;
            case "8": lang = "zh-cn"; break;
        }

        if (lang) {
            try {
                const res = await translate(pendingTranslate[sender], { to: lang });
                await conn.sendMessage(from, { text: `✅ *Translated (${lang})*\n\n${res.text}` }, { quoted: mek });
            } catch (e) {
                await conn.sendMessage(from, { text: "⚠️ Translation failed!\n\n" + e.message }, { quoted: mek });
            }

            delete pendingTranslate[sender]; // reset user
        }
    }
});
