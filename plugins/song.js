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
async (conn, mek, m, { from, quoted, reply, body, isCmd, command, args, sender }) => {
    try {
        // check user input
        let q = args.join(" ");
        if (!q) return reply("❌ Please give me a YouTube URL or a song name!");

        // search YouTube
        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return reply("⚠️ Song not found!");

        const url = data.url;

        // message caption
        let desc = `*🎵 RANUMITHA-X-MD SONG DOWNLOADER 🎵*

*Title:* ${data.title}
*Description:* ${data.description || "N/A"}
*Duration:* ${data.timestamp}
*Uploaded:* ${data.ago}
*Views:* ${data.views}

> © Powered by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // send thumbnail + details
        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: desc
        }, { quoted: mek });

        // create audio stream (no temp file)
        const audioStream = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });

        // send audio directly
        await conn.sendMessage(from, {
            audio: audioStream,
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
