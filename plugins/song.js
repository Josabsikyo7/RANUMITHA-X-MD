const { cmd } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');  // fallback

cmd({
    pattern: "song",
    alias: ["songs", "ranusong", "asong", "play"],
    react: "🎵",
    desc: "Download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, body, isCmd, command, args, sender
}) => {
    try {
        let q = args.join(" ");
        if (!q) return reply("❌ Please give me a YouTube URL or a song name!");

        const search = await yts(q);
        if (!search || !search.videos || search.videos.length === 0) {
            return reply("⚠️ No results found for your query!");
        }

        const data = search.videos[0];
        const url = data.url;

        let desc = `*🎵 RANUMITHA-X-MD SONG DOWNLOADER 🎵*

*Title:* ${data.title}
*Duration:* ${data.timestamp}
*Uploaded:* ${data.ago}
*Views:* ${data.views}

> © Powered by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // send thumbnail + details
        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: desc
        }, { quoted: mek });

        // Try api-dylux first
        let downloadUrl;
        try {
            let down = await fg.yta(url);
            downloadUrl = down.dl_url;
        } catch (err) {
            downloadUrl = null;
        }

        // If api-dylux failed → use ytdl-core
        if (!downloadUrl) {
            const info = await ytdl.getInfo(url);
            const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
            if (!format || !format.url) {
                return reply("⚠️ Failed to download audio from YouTube!");
            }
            downloadUrl = format.url;
        }

        // send audio
        await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
