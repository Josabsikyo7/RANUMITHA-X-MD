const { cmd } = require('../command');
const yts = require('yt-search');
const youtubedl = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');

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
        let q = args.join(" ");
        if (!q) return reply("❌ Please give me a YouTube URL or a song name!");

        // search video
        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return reply("⚠️ Song not found!");

        const url = data.url;

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

        // download audio using yt-dlp
        const outputPath = path.join(__dirname, `${data.title}.mp3`.replace(/[\/\\?%*:|"<>]/g, '-'));
        await youtubedl(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: outputPath,
        });

        // send audio
        const audioBuffer = fs.readFileSync(outputPath);
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

        // delete temp file
        fs.unlinkSync(outputPath);

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
