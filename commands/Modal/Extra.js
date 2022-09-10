const { EmbedBuilder, CommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
// const { ModalBuilder, ModalField } = require("discord-modal");

module.exports = {
  name: "extra",
  description: "Extra Commands!",
  options: [
    {
      name: "play-modal",
      description: "Play with modal menus!",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  run: async (interaction, client, user, language) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`${client.i18n.get(language, "utilities", "lang_perm")}`);
    
    if (interaction.options.getSubcommand() === "play-modal") {
      return interaction.editReply(`Stay back! command will success soon!`);
      const modal = new ModalBuilder()
        .setCustomId("play-extra")
        .setTitle("Play Modal")
        .addComponents(
          new ModalField() 
              .setLabel("Song name/link?")
              .setStyle("SHORT")
              .setPlaceholder("Enter your song name or link to play!")
              .setCustomId("song")
              .setRequired(true),
          new ModalField() 
              .setLabel("Channel ID?")
              .setStyle("SHORT")
              .setPlaceholder("Enter voice channel id!")
              .setCustomId("channel")
              .setRequired(true),
          new ModalField()
              .setLabel("Volume?")
              .setStyle("SHORT")
              .setPlaceholder("Enter the volume <1-9999>!")
              .setCustomId("volume")
              .setRequired(true)
        )

        await client.modal.open(interaction, modal) 

        client.on('modalSubmitInteraction', async (interaction) => {
          if (interaction.customId == "play-extra") {
              console.log("Modal is submitting")
              await interaction.deferReply({ ephemeral: false });

              const value = interaction.fields.getTextInputValue("song");

              const msg = await interaction.editReply(
                  `${client.i18n.get(language, "music", "play_loading")}`
              );

              const { channel } = interaction.member.voice;
              if (!channel)
                  return msg.edit(
                  `${client.i18n.get(language, "music", "play_invoice")}`
                  );
              if (
                  !interaction.guild.members.cache
                  .get(client.user.id)
                  .permissionsIn(channel)
                  .has(PermissionsBitField.Flags.Connect)
              )
                  return msg.edit(
                  `${client.i18n.get(language, "music", "play_join")}`
                  );
              if (
                  !interaction.guild.members.cache
                  .get(client.user.id)
                  .permissionsIn(channel)
                  .has(PermissionsBitField.Flags.Speak)
              )
                  return msg.edit(
                  `${client.i18n.get(language, "music", "play_speak")}`
                  );

              const player = await client.manager.create({
                  guild: interaction.guild.id,
                  voiceChannel: interaction.fields.getTextInputValue("channel"),
                  textChannel: interaction.channel.id,
                  selfDeafen: true,
                  volume: interaction.fields.getTextInputValue("volume"),
              });

              const state = player.state;
              if (state != "CONNECTED") await player.connect();
              const res = await client.manager.search(value, interaction.user);
              if (res.loadType != "NO_MATCHES") {
                  if (res.loadType == "TRACK_LOADED") {
                  player.queue.add(res.tracks[0]);
                  const embed = new EmbedBuilder()
                      .setDescription(
                      `${client.i18n.get(language, "music", "play_track", {
                          title: res.tracks[0].title,
                          url: res.tracks[0].uri,
                          duration: convertTime(res.tracks[0].duration, true),
                          request: res.tracks[0].requester,
                      })}`
                      )
                      .setColor(client.color);
                  msg.edit({ content: " ", embeds: [embed] });
                  if (!player.playing) player.play();
                  } else if (res.loadType == "PLAYLIST_LOADED") {
                  player.queue.add(res.tracks);
                  const embed = new EmbedBuilder()
                      .setDescription(
                      `${client.i18n.get(language, "music", "play_playlist", {
                          title: res.playlist.name,
                          url: value,
                          duration: convertTime(res.playlist.duration),
                          songs: res.tracks.length,
                          request: res.tracks[0].requester,
                      })}`
                      )
                      .setColor(client.color);
                  msg.edit({ content: " ", embeds: [embed] });
                  if (!player.playing) player.play();
                  } else if (res.loadType == "SEARCH_RESULT") {
                  player.queue.add(res.tracks[0]);
                  const embed = new EmbedBuilder()
                      .setDescription(
                      `${client.i18n.get(language, "music", "play_result", {
                          title: res.tracks[0].title,
                          url: res.tracks[0].uri,
                          duration: convertTime(res.tracks[0].duration, true),
                          request: res.tracks[0].requester,
                      })}`
                      )
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
      });
    }
  }
};
