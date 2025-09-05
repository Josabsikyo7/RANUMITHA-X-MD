const { cmd } = require('../command');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const playdl = require('play-dl');

cmd({
    pattern: "song",
    alias: ["songs", "ranusong", "asong", "play"],
    react: "🎵",
    desc: "Download songs from YouTube",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, body, isCmd, command, args, sender
}) => {
    try {
        let q = args.join(" ");
        if (!q) return reply("❌ Please give me a YouTube URL or a song name!");

        // 🔍 Search song
        const search = await yts(q);
        if (!search || !search.videos || search.videos.length === 0) {
            return reply("⚠️ No results found for your query!");
        }

        const data = search.videos[0];
        const url = data.url;

        // 📄 Description
        let desc = `*🎵 RANUMITHA-X-MD SONG DOWNLOADER 🎵*

*Title:* ${data.title}
*Duration:* ${data.timestamp}
*Uploaded:* ${data.ago}
*Views:* ${data.views}

> © Powered by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // 🖼 Send thumbnail + details
        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: desc
        }, { quoted: mek });

        let downloadUrl;

        // 🎧 Try ytdl-core first
        try {
            const info = await ytdl.getInfo(url, {
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Accept-Language': 'en-US,en;q=0.9'
                    }
                }
            });

            const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
            if (format && format.url) {
                downloadUrl = format.url;
            }
        } catch (err) {
            console.log("ytdl-core failed:", err.message);
        }

        // 🔁 If ytdl-core fails → fallback to play-dl
        if (!downloadUrl) {
            try {
                const yt_info = await playdl.video_info(url);
                const stream = await playdl.stream_from_info(yt_info, { quality: 2 });
                downloadUrl = stream.stream;
            } catch (err) {
                console.log("play-dl failed:", err.message);
                return reply("⚠️ Failed to download audio!");
            }
        }

        // 🎶 Send audio
        await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
