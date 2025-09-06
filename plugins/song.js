const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd({
  pattern: "song",
  alias: ["play", "mp3"],
  react: "🎶",
  desc: "Download YouTube song (Audio) via izumiii API",
  category: "download",
  use: ".song <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("⚠️ Please provide a song name or YouTube link.");

    const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/play?query=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data?.status || !data?.result?.downloads) {
      return reply("❌ Song not found or API error. Try again later.");
    }

    const meta = data.result.metadata;
    const downloadUrl = data.result.downloads;

    // 🔹 Fetch thumbnail
    let buffer;
    try {
      const thumbRes = await fetch(meta.thumbnail || meta.image);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {
      buffer = null;
    }

    // 🔹 Styled caption with emojis + spacing
    const caption = `
🎶 *Now Playing* 🎶

🎵 *Title:* ${meta.title}
👤 *Artist:* ${meta?.author?.name || "Unknown"}
⏱ *Duration:* ${meta?.timestamp || "N/A"}
👁 *Views:* ${meta?.views?.toLocaleString() || "N/A"}

🔗 [Watch on YouTube](${meta.url})

> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

    // 🔹 Send details card (thumbnail + styled caption)
    await conn.sendMessage(from, {
      image: buffer,
      caption: caption,
      jpegThumbnail: buffer // optional, WhatsApp will use main image
    }, { quoted: mek });

    // 🔹 Then auto-send the audio
    await conn.sendMessage(from, {
      audio: { url: downloadUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error("song cmd error:", err);
    reply("⚠️ An error occurred while processing your request.");
  }
});
