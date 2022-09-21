const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    name: ["music", "playskip"],
    description: "Play and skip to a song!",
    category: "Music",
    options: [
        {
            name: "song",
            description: "The input of the song",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.get("song").value;
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "playskip_loading")}`);
        
        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        /// Clear song
        await player.queue.clear();
        /// Clear nowplaying
        await client.clearInterval(client.interval);

        const state = player.state;
        if (state != "CONNECTED") await player.connect();
        const res = await client.manager.search(value, interaction.user);
        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                await player.queue.unshift(res.tracks[0]);
                await skipped(player);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "playskip_track", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].duration, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            } else if(res.loadType == "PLAYLIST_LOADED") {
                await player.queue.unshift(res.tracks);
                await skipped(player);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "playskip_playlist", {
                        title: res.playlist.name,
                        url: value,
                        duration: convertTime(res.playlist.duration),
                        songs: res.tracks.length,
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            } else if(res.loadType == "SEARCH_RESULT") {
                await player.queue.unshift(res.tracks[0]);
                await skipped(player);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "playskip_result", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].duration, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            } else if(res.loadType == "LOAD_FAILED") {
                msg.edit(`${client.i18n.get(language, "music", "playskip_fail")}`); 
                player.destroy();
            }
        } else {
            msg.edit(`${client.i18n.get(language, "music", "playskip_match")}`); 
            player.destroy();
        }
    }
}

function skipped(player) {
    return player.stop();
}