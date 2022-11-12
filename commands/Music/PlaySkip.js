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
            autocomplete: true
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: true,
    },
    run: async (interaction, client, user, language, player) => {
        try {
            if (interaction.options.getString("song")) {
                await interaction.deferReply({ ephemeral: false });

                const value = interaction.options.get("song").value;
 
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

                        interaction.editReply({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "PLAYLIST_LOADED") {
                        const queues = player.queue.length;
                        await player.queue.add(res.tracks);
                        await skippedpl(player, queues);

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "playskip_playlist", {
                                title: res.playlist.name,
                                url: value,
                                duration: convertTime(res.playlist.duration),
                                songs: res.tracks.length,
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)

                        interaction.editReply({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "SEARCH_RESULT") {
                        await player.queue.unshift(res.tracks[0])
                        await skipped(player);

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "playskip_result", {
                                title: res.tracks[0].title,
                                url: res.tracks[0].uri,
                                duration: convertTime(res.tracks[0].duration, true),
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)

                        interaction.editReply({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "LOAD_FAILED") {
                        interaction.editReply(`${client.i18n.get(language, "music", "playskip_fail")}`); 
                        player.destroy();
                    }
                } else {
                    interaction.editReply(`${client.i18n.get(language, "music", "playskip_match")}`); 
                    player.destroy();
                }
            }
        } catch (error) {
            ///
        }
    }
}

async function skipped(player) {
    const song = player.queue[player.queue.length - 1];

    player.queue.splice(player.queue.length - 1, 1);
    player.queue.splice(1 - 1, 0, song);

    player.stop();
}

async function skippedpl(player, queues) {
    let num = 0;
    for (let i = queues + 1; i < player.queue.length + 1; i++) {
        const song = player.queue[i - 1];
        player.queue.splice(i - 1, 1);
        player.queue.splice(num++, 0, song);
    }

    player.stop();
}