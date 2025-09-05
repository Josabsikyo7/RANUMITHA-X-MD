const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

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

        let url = q;

        // If user gave a song name instead of URL
        if (!q.startsWith("http")) {
            const search = await yts(q);
            const video = search.videos[0];
            if (!video) return reply("⚠️ Song not found!");
            url = video.url;

            // Send video info
            let desc = `*🎵 RANUMITHA-X-MD SONG DOWNLOADER 🎵*

*Title:* ${video.title}
*Duration:* ${video.timestamp}
*Uploaded:* ${video.ago}
*Views:* ${video.views}
*URL:* ${url}

> © Powered by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

            await conn.sendMessage(from, {
                image: { url: video.thumbnail },
                caption: desc
            }, { quoted: mek });
        }

        // Send URL to dcm-ytmp3-downloder API
        const apiUrl = `https://dcm-ytmp3-downloder.vercel.app/api?url=${encodeURIComponent(url)}`;
        const res = await axios.get(apiUrl);
        const data = res.data;

        if (!data || !data.audio) return reply("⚠️ Failed to convert audio!");

        // Send the audio to user
        await conn.sendMessage(from, {
            audio: { url: data.audio },
            mimetype: 'audio/mpeg',
            ptt: true // Change to false if you want normal MP3
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("⚠️ Failed to download audio!");
    }
});
