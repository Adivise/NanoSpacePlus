const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    name: ["modal", "play"],
    description: "Play with modal menus!",
    category: "Modal",
    permissions: {
        channel: [],
        bot: [],
        user: ["ManageGuild"]
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => { 
        const song_text = new TextInputBuilder()
            .setLabel("Song name?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter your song name/link!")
            .setCustomId("song")
            .setRequired(true)
        const channel_text = new TextInputBuilder()
            .setLabel("Channel ID?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter your channel id!")
            .setCustomId("channel_id")
            .setRequired(true)
        const volume_text = new TextInputBuilder()
            .setLabel("Volume?")
            .setStyle(TextInputStyle.Short)
            .setValue("100")
            .setCustomId("volume")
            .setRequired(true)

        const modal = new ModalBuilder()
            .setCustomId("play_extra")
            .setTitle("Play Music")
            .setComponents(
                new ActionRowBuilder().addComponents(song_text),
                new ActionRowBuilder().addComponents(channel_text),
                new ActionRowBuilder().addComponents(volume_text)
            )

        await interaction.showModal(modal);

        const collector = await interaction.awaitModalSubmit({ 
            time: 60000,
            filter: i => i.user.id === interaction.user.id 
        }).catch(error => {
            console.error(error);
            return null;
        });

        if (collector) {
            const value = collector.fields.getTextInputValue("song");

            // Send Message
            await collector.reply("`Success Submit...`")

            const msg = await interaction.channel.send(`${client.i18n.get(language, "music", "play_loading")}`);

            const player = await client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: collector.fields.getTextInputValue("channel_id") || interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                selfDeafen: true,
                volume: Number(collector.fields.getTextInputValue("volume")) || 100
            });

            if (player.state != "CONNECTED") await player.connect();
            const res = await client.manager.search(value, interaction.user);

            if (res.loadType != "NO_MATCHES") {
                if (res.loadType == "TRACK_LOADED") {
                    await player.queue.add(res.tracks[0]);

                    const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "music", "play_track", {
                            title: res.tracks[0].title,
                            url: res.tracks[0].uri,
                            duration: convertTime(res.tracks[0].duration, true),
                            request: res.tracks[0].requester,
                        })}`)
                        .setColor(client.color);

                    msg.edit({ content: " ", embeds: [embed] });
                    if (!player.playing) player.play();
                } else if (res.loadType == "PLAYLIST_LOADED") {
                    await player.queue.add(res.tracks);

                    const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "music", "play_playlist", {
                            title: res.playlist.name,
                            url: value,
                            duration: convertTime(res.playlist.duration),
                            songs: res.tracks.length,
                            request: res.tracks[0].requester,
                        })}`)
                        .setColor(client.color);

                    msg.edit({ content: " ", embeds: [embed] });
                    if (!player.playing) player.play();
                } else if (res.loadType == "SEARCH_RESULT") {
                    await player.queue.add(res.tracks[0]);

                    const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "music", "play_result", {
                            title: res.tracks[0].title,
                            url: res.tracks[0].uri,
                            duration: convertTime(res.tracks[0].duration, true),
                            request: res.tracks[0].requester,
                        })}`)
                        .setColor(client.color);

                    msg.edit({ content: " ", embeds: [embed] });
                    if (!player.playing) player.play();
                } else if (res.loadType == "LOAD_FAILED") {
                    msg.edit(`${client.i18n.get(language, "music", "play_fail")}`);
                    player.destroy();
                }
            } else {
                msg.edit(`${client.i18n.get(language, "music", "play_match")}`);
                player.destroy();
            }
        }
    }
}
