const { EmbedBuilder, PermissionsBitField, CommandInteraction, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");
const formatDuration = require('../../structures/FormatDuration.js');
const { SlashPage, SlashPlaylist } = require('../../structures/PageQueue.js');
const Playlist = require("../../settings/models/Playlist.js");
const humanizeDuration = require('humanize-duration');

const TrackAdd = [];

module.exports = { 
    name: "playlist",
    description: "Playlist Command!",
    options: [
        {
            name: "add",
            description: "Add song to a playlist",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the playlist",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "input",
                    description: "The song to add",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: "create",
            description: "Create a new playlist",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the playlist",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: "delete",
            description: "Delete a playlist",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the playlist",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                }
            ],
        },
        {
            name: "detail",
            description: "Detail a playlist",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the playlist",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "page",
                    description: "The page you want to view",
                    required: false,
                    type: ApplicationCommandOptionType.Integer,
                }
            ],
        },
        {
            name: "import",
            description: "Import a playlist to queue.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the playlist",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                }
            ],
        },
        {
            name: "private",
            description: "Private a playlist",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the playlist",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                }
            ],
        },
        {
            name: "public",
            description: "Public a playlist",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the playlist",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                }
            ],
        },
        {
            name: "remove",
            description: "Remove a song from a playlist",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the playlist",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "postion",
                    description: "The position of the song",
                    required: true,
                    type: ApplicationCommandOptionType.Integer
                }
            ],
        },
        {
            name: "savequeue",
            description: "Save the current queue to a playlist",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "The name of the playlist",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                }
            ],
        },
        {
            name: "view",
            description: "View my playlists",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "page",
                    description: "The page you want to view",
                    required: false,
                    type: ApplicationCommandOptionType.Integer
                }
            ],
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
run: async (interaction, client, user, language) => {
    ///// ADD SUBCOMMAND!
    await interaction.deferReply({ ephemeral: false });
    try {
        if (user && user.isPremium) {

        if (interaction.options.getSubcommand() === "add") {
        const value = interaction.options.getString("name");
        const input = interaction.options.getString("input");
                
        const PlaylistName = value.replace(/_/g, ' ');
        const Inputed = input;

        const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "add_loading")}`);
        const res = await client.manager.search(Inputed, interaction.user.id);
        const Duration = convertTime(res.tracks[0].duration, true);

        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                TrackAdd.push(res.tracks[0])
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "add_track", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].uri,
                        duration: Duration,
                        user: interaction.user
                        })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
            } else if(res.loadType == "PLAYLIST_LOADED") {
                for (let t = 0; t < res.tracks.length; t++) {
                    TrackAdd.push(res.tracks[t]);
                }
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "add_playlist", {
                        title: res.playlist.name,
                        url: Inputed,
                        duration: convertTime(res.playlist.duration),
                        track: res.tracks.length,
                        user: interaction.user
                        })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
            } else if(res.loadType == "SEARCH_RESULT") {
                TrackAdd.push(res.tracks[0]);
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "add_search", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].uri,
                        duration: Duration,
                        user: interaction.user
                        })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
            } else if (res.loadType == "LOAD_FAILED") { //Error loading playlist.
                return msg.edit(`${client.i18n.get(language, "playlist", "add_fail")}`);
            }
        } else { //The playlist link is invalid.
            return msg.edit(`${client.i18n.get(language, "playlist", "add_match")}`);
        }

            Playlist.findOne({ name: PlaylistName }).then(playlist => {
                if(playlist) {
                    if(playlist.owner !== interaction.user.id) { interaction.followUp(`${client.i18n.get(language, "playlist", "add_owner")}`); TrackAdd.length = 0; return; }
                    const LimitTrack = playlist.tracks.length + TrackAdd.length;
                    if(LimitTrack > client.config.LIMIT_TRACK) { interaction.followUp(`${client.i18n.get(language, "playlist", "add_limit_track", {
                        limit: client.config.LIMIT_TRACK
                    })}`); TrackAdd.length = 0; return; }
                    for (let songs = 0; songs < TrackAdd.length; songs++) {
                        playlist.tracks.push(TrackAdd[songs]);
                    }
                    playlist.save().then(() => {
                    const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "playlist", "add_added", {
                            count: TrackAdd.length,
                            playlist: PlaylistName
                            })}`)
                        .setColor(client.color)
                    interaction.followUp({ content: " ", embeds: [embed] });

                    TrackAdd.length = 0;
                    });
                }
            })
        }
        ////// CREATE SUBCOMMAND!
        if (interaction.options.getSubcommand() === "create") {
            const value = interaction.options.getString("name");

            if(value.length > 16) return interaction.editReply(`${client.i18n.get(language, "playlist", "create_toolong")}`);

            const PlaylistName = value.replace(/_/g, ' ');

            const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "create_loading")}`);

            const Limit = await Playlist.find({ owner: interaction.user.id }).countDocuments();
            const Exist = await Playlist.findOne({ name: PlaylistName });

            if(Exist) { msg.edit(`${client.i18n.get(language, "playlist", "create_name_exist")}`); return; }
            if(Limit >= client.config.LIMIT_PLAYLIST) { msg.edit(`${client.i18n.get(language, "playlist", "create_limit_playlist", {
                limit: client.config.LIMIT_PLAYLIST
            })}`); return; }

            const CreateNew = new Playlist({
                name: PlaylistName,
                owner: interaction.user.id,
                tracks: [],
                private: true,
                created: Date.now()
            });

            CreateNew.save().then(() => {
                const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "create_created", {
                    playlist: PlaylistName
                    })}`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
            });
        }
        ////// DELETE SUBCOMMAND!
        if (interaction.options.getSubcommand() === "delete") {
            const value = interaction.options.getString("name");

            const Plist = value.replace(/_/g, ' ');

            const playlist = await Playlist.findOne({ name: Plist });
            if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "delete_notfound")}`);
            if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "delete_owner")}`);

            await playlist.delete();

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "delete_deleted", {
                    name: Plist
                    })}`)
                .setColor(client.color)

            interaction.editReply({ embeds: [embed] });
        }
        ////// DETAIL SUBCOMMAND!
        if (interaction.options.getSubcommand() === "detail") {
            const value = interaction.options.getString("name");
            const number = interaction.options.getInteger("page");
    
            const Plist = value.replace(/_/g, ' ');
            const playlist = await Playlist.findOne({ name: Plist });
            if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_notfound")}`);
            if(playlist.private && playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_private")}`);
    
            let pagesNum = Math.ceil(playlist.tracks.length / 10);
            if(pagesNum === 0) pagesNum = 1;
    
            const playlistStrings = [];
            for(let i = 0; i < playlist.tracks.length; i++) {
                const playlists = playlist.tracks[i];
                playlistStrings.push(
                    `${client.i18n.get(language, "playlist", "detail_track", {
                        num: i + 1,
                        title: playlists.title,
                        url: playlists.uri,
                        author: playlists.author,
                        duration: formatDuration(playlists.duration)
                    })}
                    `);
            }
    
            const totalDuration = formatDuration(playlist.tracks.reduce((acc, cur) => acc + cur.duration, 0));
    
            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = playlistStrings.slice(i * 10, i * 10 + 10).join('');
                const embed = new EmbedBuilder() //${playlist.name}'s Playlists
                    .setAuthor({ name: `${client.i18n.get(language, "playlist", "detail_embed_title", {
                        name: playlist.name
                    })}`, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                    .setColor(client.color) //Page • ${i + 1}/${pagesNum} | ${playlist.tracks.length} • Songs | ${totalDuration} • Total duration
                    .setFooter({ text: `${client.i18n.get(language, "playlist", "detail_embed_footer", {
                        page: i + 1,
                        pages: pagesNum,
                        songs: playlist.tracks.length,
                        duration: totalDuration
                    })}` });
    
                pages.push(embed);
            }
            if (!number) {
                if (pages.length == pagesNum && playlist.tracks.length > 10) SlashPage(client, interaction, pages, 60000, playlist.tracks.length, totalDuration, language);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(number)) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_notnumber")}`);
                if (number > pagesNum) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_page_notfound", {
                    page: pagesNum
                })}`);
                const pageNum = number == 0 ? 1 : number - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }
        ////// IMPORT SUBCOMMAND!
        if (interaction.options.getSubcommand() === "import") {
            const value = interaction.options.getString("name");
		
            const { channel } = interaction.member.voice;
            if (!channel) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_voice")}`);
            if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_join")}`);
            if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_speak")}`);
    
            let player = client.manager.get(interaction.guild.id);
            if(!player) { player = await client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                selfDeafen: true,
            });
    
            const state = player.state;
            if (state != "CONNECTED") await player.connect();
    
            }
    
            const Plist = value.replace(/_/g, ' ');
            const SongAdd = [];
            let SongLoad = 0;
    
            const playlist = await Playlist.findOne({ name: Plist });
            if(!playlist) { interaction.editReply(`${client.i18n.get(language, "playlist", "import_notfound")}`); return; }
            if(playlist.private && playlist.owner !== interaction.user.id) { interaction.editReply(`${client.i18n.get(language, "playlist", "import_private")}`); return; }
    
            const totalDuration = convertTime(playlist.tracks.reduce((acc, cur) => acc + cur.duration, 0));
    
            const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "import_loading")}`);
    
            const embed = new EmbedBuilder() // **Imported • \`${Plist}\`** (${playlist.tracks.length} tracks) • ${message.user}
                .setDescription(`${client.i18n.get(language, "playlist", "import_imported", {
                    name: Plist,
                    tracks: playlist.tracks.length,
                    duration: totalDuration,
                    user: interaction.user
                })}`)
                .setColor(client.color)
    
            msg.edit({ content: " ", embeds: [embed] });
    
            for (let i = 0; i < playlist.tracks.length; i++) {
                const res = await client.manager.search(playlist.tracks[i].uri, interaction.user);
                if(res.loadType != "NO_MATCHES") {
                    if(res.loadType == "TRACK_LOADED") {
                        SongAdd.push(res.tracks[0]);
                        SongLoad++;
                    }
                    else if(res.loadType == "PLAYLIST_LOADED") {
                        for (let t = 0; t < res.playlist.tracks.length; t++) {
                            SongAdd.push(res.playlist.tracks[t]);
                            SongLoad++;
                        }
                    }
                    else if(res.loadType == "SEARCH_RESULT") {
                        SongAdd.push(res.tracks[0]);
                        SongLoad++;
                    }
                    else if(res.loadType == "LOAD_FAILED") {
                        { interaction.channel.send(`${client.i18n.get(language, "playlist", "import_fail")}`); player.destroy(); return; }
                    }
                }
                else {
                    { interaction.channel.send(`${client.i18n.get(language, "playlist", "import_match")}`); player.destroy(); return; }
                }
    
                if(SongLoad == playlist.tracks.length) {
                    player.queue.add(SongAdd);
                    if (!player.playing) { player.play(); }
                }
            }
        }
        ////// PRIVATE SUBCOMMAND!
        if (interaction.options.getSubcommand() === "private") {
            const value = interaction.options.getString("name");
    
            const PName = value.replace(/_/g, ' ');
     
            const playlist = await Playlist.findOne({ name: PName });
            if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_notfound")}`);
            if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_owner")}`);
    
            const Private = await Playlist.findOne({ name: PName, private: true });
            if(Private) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_already")}`);
    
            const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "private_loading")}`);
    
            playlist.private = true;
    
            playlist.save().then(() => {
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "private_success")}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
            });
        }
        ////// PUBLIC SUBCOMMAND!
        if (interaction.options.getSubcommand() === "public") {
            const value = interaction.options.getString("name");

            const PName = value.replace(/_/g, ' ');
    
            const playlist = await Playlist.findOne({ name: PName });
            if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "public_notfound")}`);
            if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "public_owner")}`);
    
            const Public = await Playlist.findOne({ name: PName, private: false });
            if(Public) return interaction.editReply(`${client.i18n.get(language, "playlist", "public_already")}`);
    
            const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "public_loading")}`);
    
            playlist.private = false;
    
            playlist.save().then(() => {
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "public_success")}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
            });
        }
        ////// REMOVE SUBCOMMAND!
        if (interaction.options.getSubcommand() === "remove") {
            const value = interaction.options.getString("name");
            const pos = interaction.options.getInteger("postion");
    
            const Plist = value.replace(/_/g, ' ');

            const playlist = await Playlist.findOne({ name: Plist });
            if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "remove_notfound")}`);
            if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "remove_owner")}`);
        
            const position = pos;
            const song = playlist.tracks[position];
            if(!song) return interaction.editReply(`${client.i18n.get(language, "playlist", "remove_song_notfound")}`);

            playlist.tracks.splice(position - 1, 1);
            await playlist.save();

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "remove_removed", {
                    name: Plist,
                    position: pos
                    })}`)
                .setColor(client.color)

            interaction.editReply({ embeds: [embed] });
        }
        ////// SAVEQUEUE SUBCOMMAND!
        if (interaction.options.getSubcommand() === "savequeue") {
            const value = interaction.options.getString("name");
    
            const Plist = value.replace(/_/g, ' ');

            const playlist = await Playlist.findOne({ name: Plist });
            if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_notfound")}`);
            if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_owner")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);

            const queue = player.queue.map(track => track);
            const current = player.queue.current;

            TrackAdd.push(current);
            TrackAdd.push(...queue);

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "savequeue_saved", {
                    name: Plist,
                    tracks: queue.length + 1
                    })}`)
                .setColor(client.color)

            interaction.editReply({ embeds: [embed] });

            playlist.tracks.push(...TrackAdd);
            playlist.save().then(() => {
                TrackAdd.length = 0;
            });
        }
        ////// VIEW SUBCOMMAND!
        if (interaction.options.getSubcommand() === "view") {
            const number = interaction.options.getInteger("page");

            const playlists = await Playlist.find({ owner: interaction.user.id });
    
            let pagesNum = Math.ceil(playlists.length / 10);
            if(pagesNum === 0) pagesNum = 1;
    
            const playlistStrings = [];
            for(let i = 0; i < playlists.length; i++) {
                const playlist = playlists[i];
                const created = humanizeDuration(Date.now() - playlists[i].created, { largest: 1 })
                playlistStrings.push(
                    `${client.i18n.get(language, "playlist", "view_embed_playlist", {
                        num: i + 1,
                        name: playlist.name,
                        tracks: playlist.tracks.length,
                        create: created
                    })}
                    `);
            }
    
            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = playlistStrings.slice(i * 10, i * 10 + 10).join('');
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${client.i18n.get(language, "playlist", "view_embed_title", {
                        user: interaction.user.username
                    })}`, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                    .setColor(client.color)
                    .setFooter({ text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
                        page: i + 1,
                        pages: pagesNum,
                        songs: playlists.length
                    })}` });
    
                pages.push(embed);
            }
            if (!number) {
                if (pages.length == pagesNum && playlists.length > 10) SlashPlaylist(client, interaction, pages, 30000, playlists.length, language);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(number)) return interaction.editReply({ content: `${client.i18n.get(language, "playlist", "view_notnumber")}` });
                if (number > pagesNum) return interaction.editReply({ content: `${client.i18n.get(language, "playlist", "view_page_notfound", {
                    page: pagesNum
                })}` });
                const pageNum = number == 0 ? 1 : number - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }
        } else {
            const Premiumed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "nopremium", "premium_author")}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`${client.i18n.get(language, "nopremium", "premium_desc")}`)
                .setColor(client.color)
                .setTimestamp()

            return interaction.editReply({ content: " ", embeds: [Premiumed] });
        }
        } catch (err) {
            console.log(err)
            interaction.editReply({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
        }
    }
}

        

    
