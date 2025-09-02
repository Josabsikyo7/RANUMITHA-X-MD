const config = require('../config');
const { cmd } = require('../command');
const axios = require("axios");

// Fake ChatGPT vCard
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© Mr Hiruka",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Meta
ORG:META AI;
TEL;type=CELL;type=VOICE;waid=13135550002:+13135550002
END:VCARD`
        }
    }
};

// Extract YouTube ID
function getYouTubeId(url) {
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})(?:&|$)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// ───────────── MP3 Downloader ─────────────
cmd({
    pattern: "song",
    alias: ["ytmp3", "mp3"],
    react: "🎵",
    desc: "Download YouTube MP3 as Document",
    category: "download",
    use: ".song <YouTube URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a YouTube URL!");
        const videoId = getYouTubeId(q);
        if (!videoId) return await reply("❌ Invalid YouTube URL!");

        await reply("⏳ Processing your song...");

        let apiUrl = `https://api.yt-download.org/api/button/mp3/${videoId}`;
        let res = await axios.get(apiUrl).then(r => r.data).catch(() => null);

        let downloadUrl = res?.url;
        if (!downloadUrl) return await reply("❌ Failed to get MP3 link!");

        let title = res?.title || `YouTube-Audio-${videoId}`;

        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            caption: `🎶 ${title}`
        }, { quoted: fakevCard });

        await reply("✅ Song Sent as Document!");

    } catch (err) {
        console.error(err);
        await reply(`❌ Error: ${err.message}`);
    }
});

// ───────────── MP4 Downloader ─────────────
cmd({
    pattern: "video",
    alias: ["ytmp4", "mp4"],
    react: "📽️",
    desc: "Download YouTube MP4 as Document",
    category: "download",
    use: ".video <YouTube URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a YouTube URL!");
        const videoId = getYouTubeId(q);
        if (!videoId) return await reply("❌ Invalid YouTube URL!");

        await reply("⏳ Processing your video...");

        let apiUrl = `https://api.yt-download.org/api/button/mp4/${videoId}`;
        let res = await axios.get(apiUrl).then(r => r.data).catch(() => null);

        let downloadUrl = res?.url;
        if (!downloadUrl) return await reply("❌ Failed to get MP4 link!");

        let title = res?.title || `YouTube-Video-${videoId}`;

        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            caption: `📽️ ${title}`
        }, { quoted: fakevCard });

        await reply("✅ Video Sent as Document!");

    } catch (err) {
        console.error(err);
        await reply(`❌ Error: ${err.message}`);
    }
});
