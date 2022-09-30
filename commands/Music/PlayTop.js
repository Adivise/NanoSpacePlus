const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    name: ["music", "insert"],
    description: "Force insert the song in top of queue",
    category: "Music",
    options: [
        {
            name: "song",
            description: "The song you want to play",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    run: async (interaction, client, user, language) => {
        try {
            if (interaction.options.getString("song")) {
                await interaction.deferReply({ ephemeral: false });

                const value = interaction.options.get("song").value;
                const msg = await interaction.editReply(`${client.i18n.get(language, "music", "playtop_loading")}`);
                
                const player = client.manager.get(interaction.guild.id);
                if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

                const state = player.state;
                if (state != "CONNECTED") await player.connect();
                const res = await client.manager.search(value, interaction.user);
                if(res.loadType != "NO_MATCHES") {
                    if(res.loadType == "TRACK_LOADED") {
                        await player.queue.add(res.tracks[0]);
                        await playtop(player);

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "playtop_track", {
                                title: res.tracks[0].title,
                                url: res.tracks[0].uri,
                                duration: convertTime(res.tracks[0].duration, true),
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)
                        msg.edit({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "PLAYLIST_LOADED") {
                        const queues = player.queue.length;
                        await player.queue.add(res.tracks);
                        await playtoppl(player, queues);

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "playtop_playlist", {
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
                        await player.queue.add(res.tracks[0]);
                        await playtop(player);

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "playtop_result", {
                                title: res.tracks[0].title,
                                url: res.tracks[0].uri,
                                duration: convertTime(res.tracks[0].duration, true),
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)
                        msg.edit({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "LOAD_FAILED") {
                        msg.edit(`${client.i18n.get(language, "music", "playtop_fail")}`); 
                        player.destroy();
                    }
                } else {
                    msg.edit(`${client.i18n.get(language, "music", "playtop_match")}`); 
                    player.destroy();
                }
            }
        } catch (error) {
            ///
        }
    }
}

function playtop(player) {
    const song = player.queue[player.queue.length - 1];

    player.queue.splice(player.queue.length - 1, 1);
    player.queue.splice(1 - 1, 0, song);
}

function playtoppl(player, queues) {
    let num = 0;
    for (let i = queues + 1; i < player.queue.length + 1; i++) {
        const song = player.queue[i - 1];
        player.queue.splice(i - 1, 1);
        player.queue.splice(num++, 0, song);
    }
}
