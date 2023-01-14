const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');
const ytsr = require("youtube-sr").default;
const Setup = require("../../settings/models/Setup.js");

module.exports = {
    name: ["nowplaying"], // I move search to main issues subcmd (max 25)
    description: "Display the song currently playing.",
    category: "Music",
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
        await interaction.deferReply({ ephemeral: false });

        const database = await Setup.findOne({ guild: interaction.guild.id });
        if (database.enable === true) return interaction.editReply(`${client.i18n.get(language, "setup", "setup_enable")}`);

        const realtime = client.config.NP_REALTIME;
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "np_loading")}`);

        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);
        const TotalDuration = formatDuration(song.duration);
        const Part = Math.floor(player.position / song.duration * 30);
        const Emoji = player.playing ? "🔴 |" : "⏸ |";
        
        const embeded = new EmbedBuilder()
            .setAuthor({ name: player.playing ? `${client.i18n.get(language, "music", "np_title")}` : `${client.i18n.get(language, "music", "np_title_pause")}`, iconURL: `${client.i18n.get(language, "music", "np_icon")}` })
            .setColor(client.color)
            .setDescription(`**[${song.title}](${song.uri})**`)
            .addFields({ name: `${client.i18n.get(language, "music", "np_author")}`, value: `${song.author}`, inline: true })
            .addFields({ name: `${client.i18n.get(language, "music", "np_request")}`, value: `${song.requester}`, inline: true })
            .addFields({ name: `${client.i18n.get(language, "music", "np_volume")}`, value: `${player.volume}%`, inline: true })
            .setTimestamp();

            if (song.thumbnail) {
                const songInfo = await ytsr.searchOne(song.uri);
                const views = songInfo.views;
                const uploadat = songInfo.uploadedAt;
                
                embeded.setThumbnail(`https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`);
                embeded.addFields({ name: `${client.i18n.get(language, "music", "np_view")}`, value: `${views}`, inline: true })
                embeded.addFields({ name: `${client.i18n.get(language, "music", "np_upload")}`, value: `${uploadat}`, inline: true })
                embeded.addFields({ name: `${client.i18n.get(language, "music", "np_download")}`, value: `**[Click Here](https://www.y2mate.com/youtube/${song.identifier})**`, inline: true })
                embeded.addFields({ name: `${client.i18n.get(language, "music", "np_current_duration", {
                    current_duration: CurrentDuration,
                    total_duration: TotalDuration
                })}`, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\``, inline: false })
            } else {
                embeded.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
                embeded.addFields({ name: `${client.i18n.get(language, "music", "np_view")}`, value: `Not Support`, inline: true })
                embeded.addFields({ name: `${client.i18n.get(language, "music", "np_upload")}`, value: `Not Support`, inline: true })
                embeded.addFields({ name: `${client.i18n.get(language, "music", "np_download")}`, value: `Not Support`, inline: true })
                embeded.addFields({ name: `${client.i18n.get(language, "music", "np_current_duration", {
                    current_duration: CurrentDuration,
                    total_duration: TotalDuration
                })}`, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\``, inline: false })
            }

        const button = client.button.nowplaying;

        const row = new  ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId("pause")
                .setLabel(`${button.pause.label}`)
                .setEmoji(`${button.pause.emoji}`)
                .setStyle(ButtonStyle[button.pause.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("replay")
                .setLabel(`${button.replay.label}`)
                .setEmoji(`${button.replay.emoji}`)
                .setStyle(ButtonStyle[button.replay.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("stop")
                .setLabel(`${button.stop.label}`)
                .setEmoji(`${button.stop.emoji}`)
                .setStyle(ButtonStyle[button.stop.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("skip")
                .setLabel(`${button.skip.label}`)
                .setEmoji(`${button.skip.emoji}`)
                .setStyle(ButtonStyle[button.skip.style])
            )
            .addComponents(
            new ButtonBuilder()
                .setCustomId("loop")
                .setLabel(`${button.loop.label}`)
                .setEmoji(`${button.loop.emoji}`)
                .setStyle(ButtonStyle[button.loop.style])
            )

        const nwp = await msg.edit({ content: " ", embeds: [embeded], components: [row] });

        if (realtime === 'true') {
        client.interval = setInterval(async () => {
            if (!player.playing) return;
            const CurrentDuration = formatDuration(player.position);
            const Part = Math.floor(player.position / song.duration * 30);
            const Emoji = player.playing ? "🔴 |" : "⏸ |";

            embeded.data.fields[6] = { name: `${client.i18n.get(language, "music", "np_current_duration", {
                current_duration: CurrentDuration,
                total_duration: TotalDuration
            })}`, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\`` };

            if (nwp) nwp.edit({ content: " ", embeds: [embeded], components: [row] })
        }, 5000);
        } else if (realtime === 'false') {
            if (!player.playing) return;
            if (nwp) nwp.edit({ content: " ", embeds: [embeded], components: [row] });
        }

        const filter = (interaction) => {
            if(interaction.guild.members.me.voice.channel && interaction.guild.members.me.voice.channelId === interaction.member.voice.channelId) return true;
            else {
                interaction.reply({ content: `${client.i18n.get(language, "music", "np_invoice")}`, ephemeral: true });
            }
        };
        const collector = msg.createMessageComponentCollector({ filter, time: song.duration });
        
        collector.on('collect', async (interaction) => {
            const id = interaction.customId;

            if(id === "pause") {
            if(!player) {
                collector.stop();
            }
            await player.pause(!player.paused);
            const uni = player.paused ? `${client.i18n.get(language, "music", "np_switch_pause")}` : `${client.i18n.get(language, "music", "np_switch_resume")}`;
        
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "np_pause_msg", {
                    pause: uni
                })}`)
                .setColor(client.color);
            
            embeded.setAuthor({ name: player.playing ? `${client.i18n.get(language, "music", "np_title")}` : `${client.i18n.get(language, "music", "np_title_pause")}`, iconURL: `${client.i18n.get(language, "music", "np_icon")}` })
            embeded.data.fields[6] = { name: `${client.i18n.get(language, "music", "np_current_duration", {
                current_duration: formatDuration(player.position),
                total_duration: TotalDuration
            })}`, value: `\`\`\`${player.playing ? "🔴 |" : "⏸ |"} ${'─'.repeat(Math.floor(player.position / song.duration * 30)) + '🎶' + '─'.repeat(30 - Math.floor(player.position / song.duration * 30))}\`\`\`` };

            if(nwp) await nwp.edit({ embeds: [embeded] });
            interaction.reply({ embeds: [embed], ephemeral: true });
            } else if(id === "replay") {
            if(!player) {
                collector.stop();
            }

            await player.seek(0);
            
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "np_replay_msg")}`)
                .setColor(client.color);;
        
            interaction.reply({ embeds: [embed], ephemeral: true });
            } else if(id === "stop") {
            if(!player) {
                collector.stop();
            }
        
            await player.stop();
            await player.destroy();
        
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "np_stop_msg")}`)
                .setColor(client.color);

            await client.clearInterval(client.interval);
            if (nwp) await nwp.edit({ components: [] })
            interaction.reply({ embeds: [embed], ephemeral: true });
            } else if (id === "skip") {
            if(!player) {
                collector.stop();
            }
            await player.stop();
        
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "np_skip_msg")}`)
                .setColor(client.color);

            await client.clearInterval(client.interval);
            if (nwp) await nwp.edit({ components: [] });
            interaction.reply({ embeds: [embed], ephemeral: true });
            } else if(id === "loop") {
            if(!player) {
                collector.stop();
            }
            await player.setTrackRepeat(!player.trackRepeat);
            const uni = player.trackRepeat ? `${client.i18n.get(language, "music", "np_switch_enable")}` : `${client.i18n.get(language, "music", "np_switch_disable")}`;
        
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "np_repeat_msg", {
                    loop: uni
                    })}`)
                .setColor(client.color);
        
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
        });

        collector.on('end', async (collected, reason) => {
            if(reason === "time") {
                if (nwp) await nwp.edit({ components: [] });
                await client.clearInterval(client.interval);
            }
        });
    }
}