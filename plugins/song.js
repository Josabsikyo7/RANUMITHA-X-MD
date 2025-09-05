const { cmd } = require('../command');
const yts = require('yt-search');
const playdl = require('play-dl');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);

cmd({
    pattern: "song",
    alias: ["songs", "ranusong", "asong", "play"],
    react: "🎵",
    desc: "Download songs from YouTube",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, args
}) => {
    try {
        let q = args.join(" ");
        if (!q) return reply("❌ Please give me a YouTube URL or a song name!");

        // 🔍 Search
        const search = await yts(q);
        if (!search || !search.videos || search.videos.length === 0) {
            return reply("⚠️ No results found!");
        }

        const data = search.videos[0];
        const url = data.url;

        // 🖼 Info msg
        let desc = `*🎵 RANUMITHA-X-MD SONG DOWNLOADER 🎵*

*Title:* ${data.title}
*Duration:* ${data.timestamp}
*Uploaded:* ${data.ago}
*Views:* ${data.views}`;

        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: desc
        }, { quoted: mek });

        // 🎧 Download with play-dl → to temp file
        const stream = await playdl.stream(url, { quality: 2 });
        const filePath = `./temp_${Date.now()}.mp3`;

        await streamPipeline(stream.stream, fs.createWriteStream(filePath));

        // 🎶 Send audio as buffer
        const buffer = fs.readFileSync(filePath);
        await conn.sendMessage(from, {
            audio: buffer,
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

        fs.unlinkSync(filePath); // delete temp file

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
