const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    name: ["search"], // I move search to main issues subcmd (max 25)
    description: "Search for a song!",
    category: "Music",
    options: [
        {
            name: "song",
            description: "The input of the song",
            type: ApplicationCommandOptionType.String,
            required: true,
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
        await interaction.deferReply({ ephemeral: false });

        const search = interaction.options.get("song").value;
        const msg = await interaction.editReply(`${client.emotes.search} Searching for \`${search}\`...`);
        
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true,
        });

        const button = client.button.search;

        const row = new  ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId("one")
                .setLabel(`${button.one.label}`)
                .setEmoji(`${button.one.emoji}`)
                .setStyle(ButtonStyle[button.one.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("two")
                .setLabel(`${button.two.label}`)
                .setEmoji(`${button.two.emoji}`)
                .setStyle(ButtonStyle[button.two.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("three")
                .setLabel(`${button.three.label}`)
                .setEmoji(`${button.three.emoji}`)
                .setStyle(ButtonStyle[button.three.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("four")
                .setLabel(`${button.four.label}`)
                .setEmoji(`${button.four.emoji}`)
                .setStyle(ButtonStyle[button.four.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("five")
                .setLabel(`${button.five.label}`)
                .setEmoji(`${button.five.emoji}`)
                .setStyle(ButtonStyle[button.five.style])
            )

        if (player.state != "CONNECTED") await player.connect();
        const res = await client.manager.search(search, interaction.user);

        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                await player.queue.add(res.tracks[0]);

                const embed = new EmbedBuilder() //`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}
                    .setDescription(`${client.i18n.get(language, "music", "search_result", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].duration, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)

                msg.edit({ content: " ", embeds: [embed] });
                if (!player.playing) player.play();
                } else if(res.loadType == "SEARCH_RESULT") {
                    let index = 1;
                    const results = res.tracks
                        .slice(0, 5) //**(${index++}.) [${video.title}](${video.uri})** \`${convertTime(video.duration)}\` Author: \`${video.author}\`
                        .map(video => `${client.i18n.get(language, "music", "search_select", {
                            num: index++,
                            title: video.title,
                            url: video.uri,
                            duration: convertTime(video.duration),
                            author: video.author
                        })}`)
                        .join("\n");
                    const playing = new EmbedBuilder()
                        .setAuthor({ name: `${client.i18n.get(language, "music", "search_title")}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setColor(client.color)
                        .setDescription(results)
                        .setFooter({ text: `${client.i18n.get(language, "music", "search_footer")}` })
                    await msg.edit({ content: " ", embeds: [playing], components: [row] });

                    const collector = msg.createMessageComponentCollector({ filter: (m) => m.user.id === interaction.user.id, time: 30000, max: 1 });

                    collector.on('collect', async (interaction) => {
                        if(!player && !collector.ended) return collector.stop();
                        const id = interaction.customId;

                        if(id === "one") {
                            await player.queue.add(res.tracks[0]);

                            if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}
                                .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                    title: res.tracks[0].title,
                                    url: res.tracks[0].uri,
                                    duration: convertTime(res.tracks[0].duration, true),
                                    request: res.tracks[0].requester
                                })}`)
                                .setColor(client.color)
            
                            if(msg) await msg.edit({ embeds: [embed], components: [] });
                        } else if(id === "two") {
                            await player.queue.add(res.tracks[1]);

                            if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[1].title}](${res.tracks[1].uri})** \`${convertTime(res.tracks[1].duration, true)}\` • ${res.tracks[1].requester}
                                .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                    title: res.tracks[1].title,
                                    url: res.tracks[1].uri,
                                    duration: convertTime(res.tracks[1].duration, true),
                                    request: res.tracks[1].requester
                                })}`)
                                .setColor(client.color)
        
                            if(msg) await msg.edit({ embeds: [embed], components: [] });
                        } else if(id === "three") {
                            await player.queue.add(res.tracks[2]);

                            if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[2].title}](${res.tracks[2].uri})** \`${convertTime(res.tracks[2].duration, true)}\` • ${res.tracks[2].requester}
                                .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                    title: res.tracks[2].title,
                                    url: res.tracks[2].uri,
                                    duration: convertTime(res.tracks[2].duration, true),
                                    request: res.tracks[2].requester
                                })}`)
                                .setColor(client.color)
        
                            if(msg) await msg.edit({ embeds: [embed], components: [] });
                        } else if(id === "four") {
                            await player.queue.add(res.tracks[3]);

                            if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[3].title}](${res.tracks[3].uri})** \`${convertTime(res.tracks[3].duration, true)}\` • ${res.tracks[3].requester}
                                .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                    title: res.tracks[3].title,
                                    url: res.tracks[3].uri,
                                    duration: convertTime(res.tracks[3].duration, true),
                                    request: res.tracks[3].requester
                                    })}`)
                                .setColor(client.color)
        
                            if(msg) await msg.edit({ embeds: [embed], components: [] });
                        } else if(id === "five") {
                            await player.queue.add(res.tracks[4]);

                            if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

                            const embed = new EmbedBuilder() //**Queued • [${res.tracks[4].title}](${res.tracks[4].uri})** \`${convertTime(res.tracks[4].duration, true)}\` • ${res.tracks[4].requester}
                                .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                    title: res.tracks[4].title,
                                    url: res.tracks[4].uri,
                                    duration: convertTime(res.tracks[4].duration, true),
                                    request: res.tracks[4].requester
                                    })}`)
                                .setColor(client.color)
        
                            if(msg) await msg.edit({ embeds: [embed], components: [] });
                        }
                    });

                    collector.on('end', async (collected, reason) => {
                        if(reason === "time") {
                            msg.edit({ content: `${client.i18n.get(language, "music", "search_no_response")}`, embeds: [], components: [] });
                            player.destroy();
                        }
                    });

                } else if(res.loadType == "PLAYLIST_LOADED") {
                    await player.queue.add(res.tracks);

                    const playlist = new EmbedBuilder() //**Queued** • [${res.playlist.name}](${search}) \`${convertTime(res.playlist.duration)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}
                        .setDescription(`${client.i18n.get(language, "music", "search_playlist", {
                            title: res.playlist.name,
                            url: search,
                            duration: convertTime(res.playlist.duration),
                            songs: res.tracks.length,
                            request: res.tracks[0].requester
                        })}`)
                        .setColor(client.color)

                    msg.edit({ content: " ", embeds: [playlist] });
                    if(!player.playing) player.play()
                } else if(res.loadType == "LOAD_FAILED") {
                    msg.edit(`${client.i18n.get(language, "music", "search_fail")}`);
                    player.destroy();
                }
            } else {
                msg.edit(`${client.i18n.get(language, "music", "search_match")}`);
                player.destroy();
        }
    }
}