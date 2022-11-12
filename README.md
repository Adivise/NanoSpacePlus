<p align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=NanoSpacePlus&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient"/> </a> 
</p>

<p align="center"> 
  <a href="https://discord.gg/SNG3dh3MbR" target="_blank"> <img src="https://discordapp.com/api/guilds/903043706410643496/widget.png?style=banner2"/> </a> 
</p>

<p align="center"> 
  <a href="https://ko-fi.com/nanotect" target="_blank"> <img src="https://ko-fi.com/img/githubbutton_sm.svg"/> </a> 
</p>

## 📑 Feature
- [x] Music System (AutoComplete [Play, Playskip, Playtop])
- [x] Playlists System (AutoComplete, [All])
- [x] Premium System (Ko-Fi Support!)
- [x] Setup Request System
- [x] Multi Language
- [x] Slash Command (Base, Group, Sub)
- [x] Context Message Menu
- [x] Custom Filters
- [x] Easy to use

## 🎶 Support Source
- [x] Youtube
- [x] SoundCloud
- [x] Twitch
- [x] Bandcamp
- [x] Vimeo
- [x] Https (Radio)

<details><summary>📃 Plugins (More Support Source) [CLICK ME]</summary>
<p>

## 📃 Plugins (More Support Source) (Require: LavaLink v3.6.x)
- [x] [LavaSrc](https://github.com/TopiSenpai/LavaSrc)
- Spotify
- Deezer
- Apple
- Yandex

- [x] [skybot-lavalink-plugin](https://github.com/DuncteBot/skybot-lavalink-plugin)
- Mixcloud
- Ocremix
- Clyp
- Reddit
- Getyarn
- TikTok
- PornHub
- Soundgasm

</p>
</details>

<details><summary>📎 Requirements [CLICK ME]</summary>
<p>

## 📎 Requirements

- [x] Node.js v16+ **[Download](https://nodejs.org/en/download/)**
- [x] Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
- [x] LavaLink **[Guide](https://github.com/freyacodes/lavalink)** (*Dev Version!* **[Download](https://ci.fredboat.com/repository/)**)
- [My Application File](https://cdn.discordapp.com/attachments/1010784573061349496/1038914440734715994/application.yml)
- [x] MongoDB **[Download](https://www.mongodb.com/try/download/community)** (Download & install = Finish!)

## 🛑 Super Requirements 

- Java 11-13 **[Download JDK13](http://www.mediafire.com/file/m6gk7aoq96db8g0/file)** (i use this version) for LAVALINK!

</p>
</details>

## 📚 Installation

```
git clone https://github.com/Adivise/NanoSpacePlus
cd NanoSpacePlus
npm install
```

<details><summary>📄 Configuration [CLICK ME]</summary>
<p>

## 📄 Configuration

Copy or Rename `.env.example` to `.env` and fill out the values:

```.env
# Bot
TOKEN=REPLACE_HERE
NP_REALTIME=false
LEAVE_TIMEOUT=120000
LANGUAGE=en
EMBED_COLOR=#000001

# Dev
OWNER_ID=REPLACE_HERE

# Database
MONGO_URI=mongodb://127.0.0.1:27017/nanospaceplus
LIMIT_TRACK=50
LIMIT_PLAYLIST=10

# Nodes
NODE_HOST=localhost
NODE_PORT=5555
NODE_PASSWORD=123456
```
After installation or finishes all you can use `node .` to start the bot. or `Run Start.bat`

</p>
</details>

<details><summary>🔩 Features & Commands [CLICK ME]</summary>
<p>

## 🔩 Features & Commands

> Note: The default prefix is '/'

💬 **Context Menu**
- Play (Right-Click & Apps > Context | Play) 
- Skip (Right-Click & Apps > Context | Skip) 
- Stop (Right-Click & Apps > Context | Stop) 
- Shuffle (Right-Click & Apps > Context | Shuffle) 
- Loop (Right-Click & Apps > Context | Loop) 

💬 **Extra Commands!**
- Play (/extra play) 

🎶 **Music Commands!** 

- Play (/play [song/url])
- Search (/search [songname])
- Nowplaying (/nowplaying)
- Queue (/music queue [page])
- Loop (/music loop [current, queue])
- LoopQueue (/music loopqueue)
- Shuffle (/music shuffle)
- Volume (/music volume [10 - 100])
- Pause (/music pause)
- Resume (/music resume)
- Skip (/music skip)
- Skipto (/music skipto [position])
- Clear (/musicclear)
- Join (/music join)
- Leave (/music leave)
- Forward (/music forward [second])
- Seek (/music seek [second])
- Rewind (/music rewind [second])
- Replay (/music replay)
- TwentyFourSeven (/music 247)
- Previous (/music previous)
- Autoplay (/music autoplay)
- Move (/music move [song] [position])
- Remove (/music remove [song])
- PlaySkip (/music playskip [song/url])
- SearchSkip (/music searchskip [songname])
- PlayTop (/music playtop [song/url])
- SearchTop (/music searchtop [songname])
- SearchSkip (/music searchskip [song/url])
- PlayTop (/music playtop [song/url])
- SearchTop (/music searchtop [song/url])
- Charts (/charts [global/guild])

⏺ **Filter Commands!**
- Bass (/filter bass)
- Superbass (/filter superbass)
- Pop (/filter pop)
- Treblebass (/filter treblebass)
- Soft (/filter soft)
- Earrape (/filter earrape)
- Equalizer (/filter equalizer [14 bands])
- Speed (/filter speed [amount])
- Picth (/filter pitch [amount])
- Vaporwave (/filter vaporwave)
- Nightcore (/filter nightcore)
- Bassboost (/filter bassboost [-10 - 10])
- Rate (/filter rate)
- Reset (/filter reset)
- 3d (/filter 3d)
- China (/filter china)
- Chipmunk (/filter chipmunk)
- Darthvader (/filter darthvader)
- DoubleTime (/filter doubletime)
- SlowMotion (/filter slowmotion)
- Tremolo (/filter tremolo)
- Vibrate (/filter vibrate)
- Vibrato (/filter vibrato)
- Daycore (/filter daycore)
- Television (/filter Television)
	
📦 **Playlist Commands!**
- Create (/playlist create [name])
- Add (/playlist add [name] [link])
- Private (/playlist private [name])
- Public (/playlist public [name])
- Delete (/playlist delete [name])
- Import (/playlist import [name])
- Detail (/playlist detail [name])
- Remove (/playlist remove [name] [position])
- SaveCurrent (/playlist savecurrent [name])
- SaveQueue (/playlist savequeue [name])
- View (/playlist view)
	
💎 **Premium Commands!**
- Profile (/profile)
- Generate (/premium generate [plan] [amount]) // (OWNER ONLY)
- Redeem (/redeem [code])
- Setup (/premium setup)
- Transaction (/premium transaction [id])
- Remove (/premium remove [mention]) // (OWNER ONLY)
	
📑 **Utility Commands!**
- Shutdown (/utility shutdown) // (OWNER ONLY)
- Language (/utility language [language] ) // Example: en, th
- Help (/help)
- CommandStats (/commandstats)
- Vps (/utility vps)
- LavaLink (/utility lavalink)

</p>
</details>

## ❣ Contributors

<a href="https://github.com/Adivise/NanoSpacePlus/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=Adivise/NanoSpacePlus" />
</a>
