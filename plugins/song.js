const { cmd } = require('../command');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "song",
    alias: ["songs", "ranusong", "asong", "play"],
    react: "🎵",
    desc: "Download songs as MP3",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Please provide a YouTube link or song name!");

        // temporary filename
        const fileName = `song_${Date.now()}.mp3`;
        const filePath = path.join(__dirname, fileName);

        reply("⏳ Downloading your song...");

        // yt-dlp command: download best audio as mp3
        const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${filePath}" "${query}"`;

        exec(command, async (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                return reply("❌ Failed to download the song!");
            }

            if (!fs.existsSync(filePath)) {
                return reply("❌ Download failed, file not found!");
            }

            // send audio to WhatsApp
            await conn.sendMessage(from, {
                audio: fs.readFileSync(filePath),
                mimetype: "audio/mpeg",
                fileName: fileName
            }, { quoted: mek });

            // delete temporary file
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.log(error);
        reply(`❌ Error: ${error.message}`);
    }
});
