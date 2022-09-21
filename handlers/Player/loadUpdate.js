const { EmbedBuilder } = require("discord.js");
const formatDuration = require("../../structures/FormatDuration.js");
const GLang = require("../../settings/models/Language.js");
const Setup = require("../../settings/models/Setup.js");
  
module.exports = async (client) => {

    client.UpdateQueueMsg = async function (player) {
        const data = await Setup.findOne({ guild: player.guild });
        if (data.enable === false) return;

        const channel = await client.channels.cache.get(data.channel);
        if (!channel) return;

        const playMsg = await channel.messages.fetch(data.playmsg, { cache: false, force: true });
        if (!playMsg) return;
    
        const guildModel = await GLang.findOne({ guild: player.guild });
        const { language } = guildModel;

        const songStrings = [];
        const queuedSongs = player.queue.map((song, i) => `${client.i18n.get(language, "setup", "setup_content_queue", {
            index: i + 1,
            title: song.title,
            duration: formatDuration(song.duration),
            request: song.requester.tag,
        })}`);

        songStrings.push(...queuedSongs);

        const Str = songStrings.slice(0, 10).join('\n');

        const cSong = player.queue.current;
        const qDuration = `${formatDuration(player.queue.duration)}`;

        const played = player.playing ? `${client.i18n.get(language, "setup", "setup_nowplay")}` : `${client.i18n.get(language, "setup", "setup_songpause")}`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${played}`, iconURL: `${client.i18n.get(language, "setup", "setup_author_icon")}` })
            .setDescription(`${client.i18n.get(language, "setup", "setup_desc", {
                title: cSong.title,
                url: cSong.uri,
                duration: formatDuration(cSong.duration),
                request: cSong.requester,
            })}`) // [${cSong.title}](${cSong.uri}) \`[${formatDuration(cSong.duration)}]\` • ${cSong.requester}
            .setColor(client.color)
            .setImage(`https://img.youtube.com/vi/${cSong.identifier}/sddefault.jpg`)
            .setFooter({ text: `${client.i18n.get(language, "setup", "setup_footer", {
                songs: player.queue.length,
                volume: player.volume,
                duration: qDuration,
            })}` }) //${player.queue.length} • Song's in Queue | Volume • ${player.volume}% | ${qDuration} • Total Duration

        return playMsg.edit({ 
            content: `${client.i18n.get(language, "setup", "setup_content")}\n${Str == '' ? `${client.i18n.get(language, "setup", "setup_content_empty")}` : '\n' + Str}`, 
            embeds: [embed], 
            components: [client.enSwitch] 
        }).catch((e) => {});
    };

    client.UpdateMusic = async function (player) {
        const data = await Setup.findOne({ guild: player.guild });
        if (data.enable === false) return;

        const channel = await client.channels.cache.get(data.channel);
        if (!channel) return;

        const playMsg = await channel.messages.fetch(data.playmsg, { cache: true, force: true });
        if (!playMsg) return;
    
        const guildModel = await GLang.findOne({ guild: player.guild });
        const { language } = guildModel;

        const queueMsg = `${client.i18n.get(language, "setup", "setup_queuemsg")}`;

        const playEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: `${client.i18n.get(language, "setup", "setup_playembed_author")}` })
          .setImage(`${client.i18n.get(language, "setup", "setup_playembed_image")}`)
          .setDescription(`${client.i18n.get(language, "setup", "setup_playembed_desc", {
              clientId: client.user.id,
          })}`)
          .setFooter({ text: `${client.i18n.get(language, "setup", "setup_playembed_footer")}` });

        return playMsg.edit({ 
            content: `${queueMsg}`, 
            embeds: [playEmbed], 
            components: [client.diSwitch] 
        }).catch((e) => {});
    };
};