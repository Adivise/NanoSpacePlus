const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");
const Playlist = require("../../settings/models/Playlist.js");

const tracks = [];

module.exports = {
    name: ["playlist", "add"],
    description: "Add song to a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        },
        {
            name: "song",
            description: "The song to add",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const name = interaction.options.getString("name");
        const song = interaction.options.getString("song");

        const PName = name.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_notfound")}`);

        const res = await client.manager.search(song, interaction.user);

        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                tracks.push(res.tracks[0]);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "add_track", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].duration, true),
                        user: interaction.user
                        })}`)
                    .setColor(client.color)

                interaction.editReply({ embeds: [embed] });
            } else if(res.loadType == "PLAYLIST_LOADED") {
                for (let i = 0; i < res.tracks.length; i++) {
                    tracks.push(res.tracks[i]);
                }

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "add_playlist", {
                        title: res.playlist.name,
                        url: song,
                        duration: convertTime(res.playlist.duration),
                        track: res.tracks.length,
                        user: interaction.user
                        })}`)
                    .setColor(client.color)

                interaction.editReply({ embeds: [embed] });
            } else if(res.loadType == "SEARCH_RESULT") {
                tracks.push(res.tracks[0]);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "add_search", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].duration, true),
                        user: interaction.user
                        })}`)
                    .setColor(client.color)

                interaction.editReply({ embeds: [embed] });
            } else if (res.loadType == "LOAD_FAILED") { //Error loading playlist.
                return interaction.editReply(`${client.i18n.get(language, "playlist", "add_fail")}`);
            }
        } else { //The playlist link is invalid.
            return interaction.editReply(`${client.i18n.get(language, "playlist", "add_match")}`);
        }

        Playlist.findOne({ name: PName }).then(playlist => {
            if(playlist) {
                if(playlist.owner !== interaction.user.id) { 
                    interaction.followUp(`${client.i18n.get(language, "playlist", "add_owner")}`); 
                    tracks.length = 0; 
                    return; 
                }

                const LimitTrack = playlist.tracks.length + tracks.length;

                if(LimitTrack > client.config.LIMIT_TRACK) { 
                    interaction.followUp(`${client.i18n.get(language, "playlist", "add_limit_track", {
                        limit: client.config.LIMIT_TRACK
                    })}`); 
                    tracks.length = 0; 
                    return; 
                }

                for (let i = 0; i < tracks.length; i++) {
                    playlist.tracks.push(tracks[i]);
                }

                playlist.save().then(() => {
                    const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "playlist", "add_added", {
                            count: tracks.length,
                            playlist: PName
                            })}`)
                        .setColor(client.color)
                    interaction.followUp({ content: " ", embeds: [embed] });
                tracks.length = 0;
                });
            }
        });
    }
}