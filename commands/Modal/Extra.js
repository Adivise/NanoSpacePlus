const { EmbedBuilder, CommandInteraction, ApplicationCommandOptionType, PermissionsBitField, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
  name: "extra",
  description: "Extra Commands!",
  options: [
    {
      name: "play",
      description: "Play with modal menus!",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  run: async (interaction, client, user, language) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply(`${client.i18n.get(language, "utilities", "lang_perm")}`);
    
    if (interaction.options.getSubcommand() === "play") {
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

        const submitted = await interaction.awaitModalSubmit({ 
            time: 12000,
            filter: i => i.user.id === interaction.user.id 
        });

        if (submitted) {
                const value = submitted.fields.getTextInputValue("song");

                // Send Message
                await submitted.reply("`Success Submit...`")

                const msg = await interaction.channel.send(`${client.i18n.get(language, "music", "play_loading")}`);

                const { channel } = interaction.member.voice;
                // Not need in voice to play
              //  if (!channel) return msg.edit(`${client.i18n.get(language, "music", "play_invoice")}`);
                if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Connect)) return msg.edit(`${client.i18n.get(language, "music", "play_join")}`);
                if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Speak)) return msg.edit(`${client.i18n.get(language, "music", "play_speak")}`);

                const player = await client.manager.create({
                    guild: interaction.guild.id,
                    voiceChannel: submitted.fields.getTextInputValue("channel_id"),
                    textChannel: interaction.channel.id,
                    selfDeafen: true,
                    volume: Number(submitted.fields.getTextInputValue("volume")) || 100
                });

                const state = player.state;
                if (state != "CONNECTED") await player.connect();
                const res = await client.manager.search(value, interaction.user);
                if (res.loadType != "NO_MATCHES") {
                    if (res.loadType == "TRACK_LOADED") {
                        // 
                        player.queue.add(res.tracks[0]);
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
                        //
                        player.queue.add(res.tracks);
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
                        //
                        player.queue.add(res.tracks[0]);
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
}
