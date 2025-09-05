const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "song",
    alias: ["songs", "ranusong", "asong", "play"],
    react: "🎵",
    desc: "Download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply, args }) => {
    try {
        let q = args.join(" ");
        if (!q) return reply("❌ Please give me a YouTube song name!");

        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return reply("⚠️ Song not found!");

        // send details first
        let desc = `*🎵 RANUMITHA-X-MD SONG DOWNLOADER 🎵*

*Title:* ${data.title}
*Duration:* ${data.timestamp}
*Uploaded:* ${data.ago}
*Views:* ${data.views}
*URL:* ${data.url}

> © Powered by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: desc
        }, { quoted: mek });

        // try to send audio from URL
        await conn.sendMessage(from, {
            audio: { url: data.url },  // <- YouTube url
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("⚠️ Failed to send audio!");
    }
});
