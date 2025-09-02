const { cmd } = require('../command');
const translate = require('@vitalets/google-translate-api'); // install this: npm i @vitalets/google-translate-api

// Language menu
const langMenu = `
╭─『 🌍 𝗧𝗥𝗔𝗡𝗦𝗟𝗔𝗧𝗘 𝗠𝗘𝗡𝗨 』───❏
│ 1. Sinhala (si)
│ 2. English (en)
│ 3. Hindi (hi)
│ 4. Tamil (ta)
│ 5. Arabic (ar)
│ 6. French (fr)
│ 7. German (de)
│ 8. Japanese (ja)
│ 9. Chinese (zh-cn)
│ 10. Russian (ru)
╰───────────────
Reply with the number (e.g., 2)`;

cmd({
  pattern: "translate",
  desc: "Translate any text to selected language",
  category: "tools",
  react: "🌍",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Step 1: get the text after command
    let text = m.body.split(" ").slice(1).join(" ");
    if (!text) return reply("✏️ Please provide a text to translate.\n\nUsage: .translate Hello world");

    // Step 2: ask for target language
    const ask = await conn.sendMessage(from, { text: `📌 Which language do you want?\n${langMenu}\n\n👉 Reply with number` }, { quoted: mek });
    const msgID = ask.key.id;

    // Step 3: listen for reply
    conn.ev.on("messages.upsert", async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!msg.message) return;

      const fromUser = msg.key.remoteJid;
      const userReply = msg.message.conversation || msg.message.extendedTextMessage?.text;
      const quotedId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;

      if (quotedId !== msgID) return; // only reply to our menu

      // Language map
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

      const lang = langMap[userReply.trim()];
      if (!lang) {
        return conn.sendMessage(fromUser, { text: "❌ Invalid choice! Please reply with 1-10" }, { quoted: msg });
      }

      // Step 4: translate
      try {
        const res = await translate(text, { to: lang });
        await conn.sendMessage(fromUser, { text: `🌍 *Translated (${lang})*\n\n${res.text}` }, { quoted: msg });
      } catch (e) {
        await conn.sendMessage(fromUser, { text: "⚠️ Translation failed!" }, { quoted: msg });
      }
    });

  } catch (e) {
    console.error(e);
    reply("❌ Error: " + e.message);
  }
});
