const { cmd } = require('../command');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

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
        if (!q) return reply("❌ Please give me a YouTube URL or song name!");

        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return reply("⚠️ Song not found!");

        const url = data.url;

        let desc = `*🎵 RANUMITHA-X-MD SONG DOWNLOADER 🎵*

*Title:* ${data.title}
*Duration:* ${data.timestamp}
*Uploaded:* ${data.ago}
*Views:* ${data.views}
*URL:* ${url}

> © Powered by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // send thumbnail + details
        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: desc
        }, { quoted: mek });

        // download audio using ytdl-core
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });

        // send as mp3 document
        await conn.sendMessage(from, {
            document: { stream },
            mimetype: 'audio/mpeg',
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("⚠️ Failed to download audio!");
    }
});
