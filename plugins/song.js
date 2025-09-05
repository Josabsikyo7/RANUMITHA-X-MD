const { cmd } = require('../command');
const fg = require('api-dylux')
const yts = require('yt-search')


cmd({
    pattern: "song",
    alias: ["songs", "ranusong", "asong", "play"],
    react: "🎵",
    desc: "dowonload songs",
    category: "dowonload",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, body, isCmd, command, args, sender
}) => {
    try{
if(!q) return reply("Please give me url or title/song name")  
const search = await yts(q)    
const data = search.video[0];
const url = data.url

let desc = `*RANUMITHA-X-MD SONG DOWONLOADR*

title: ${data.title}
description: ${data.description}
time: ${data.timestamp}
ago: ${data.ago}
views: ${data.views}

> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`

await conn sendMessage(from.{image:{url: data.thumbnail},caption:desc},{quoted:mek});
//dowonload audio

let down = await fg.yta(url)
let dowonloadUrl = down.dl_url

//send audio message
await conn.sendMessage(from,{audio: {url:dowonloadUrl},minetype:"audio/mpeg"},{quoted:mek})

    
 }catch(e){
 console.log(e)
 reply(`${e}`)   
 }
 })
