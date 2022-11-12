const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    name: ["play"], // I move play to main issues subcmd (max 25)
    description: "Plays a song of your choice",
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
    permissions: {
        channel: ["Speak", "Connect"],
        bot: ["Speak", "Connect"],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: true,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        try {
            if (interaction.options.getString("song")) {
                await interaction.deferReply({ ephemeral: false });

                const value = interaction.options.get("song").value;

                const player = client.manager.create({
                    guild: interaction.guild.id,
                    voiceChannel: interaction.member.voice.channel.id,
                    textChannel: interaction.channel.id,
                    selfDeafen: true,
                });
                
                if (player.state != "CONNECTED") await player.connect();
                const res = await client.manager.search(value, interaction.user);

                if(res.loadType != "NO_MATCHES") {
                    if(res.loadType == "TRACK_LOADED") {
                        await player.queue.add(res.tracks[0]);

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "play_track", {
                                title: res.tracks[0].title,
                                url: res.tracks[0].uri,
                                duration: convertTime(res.tracks[0].duration, true),
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)

                        interaction.editReply({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "PLAYLIST_LOADED") {
                        await player.queue.add(res.tracks)

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "play_playlist", {
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
                        await player.queue.add(res.tracks[0]);

                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "music", "play_result", {
                                title: res.tracks[0].title,
                                url: res.tracks[0].uri,
                                duration: convertTime(res.tracks[0].duration, true),
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)

                        interaction.editReply({ content: " ", embeds: [embed] });
                        if(!player.playing) player.play();
                    } else if(res.loadType == "LOAD_FAILED") {
                        interaction.editReply(`${client.i18n.get(language, "music", "play_fail")}`); 
                        player.destroy();
                    }
                } else {
                    interaction.editReply(`${client.i18n.get(language, "music", "play_match")}`); 
                    player.destroy();
                }
            }
        } catch (error) {
            //
        }
    }
}
