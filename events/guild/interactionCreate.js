const { PermissionsBitField, InteractionType } = require("discord.js");
const GLang = require("../../settings/models/Language.js");
const Playlist = require("../../settings/models/Playlist.js");
const chalk = require('chalk');
const { SEARCH_DEFAULT } = require("../../settings/config.js")
const yt = require("youtube-sr").default;
const { REGEX } = require("../../settings/regex.js");

module.exports = async(client, interaction) => {
    if (interaction.isCommand || interaction.isContextMenuCommand || interaction.isModalSubmit || interaction.isChatInputCommand) {
        if (!interaction.guild || interaction.user.bot) return;

        const user = client.premiums.get(interaction.user.id);
        await client.createDatabase(interaction);

		    const guildModel = await GLang.findOne({ guild: interaction.guild.id });
        const { language } = guildModel;

        let subCommandName = "";
        try {
          subCommandName = interaction.options.getSubcommand();
        } catch { };
        let subCommandGroupName = "";
        try {
          subCommandGroupName = interaction.options.getSubcommandGroup();
        } catch { };

        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
          const url = interaction.options.getString("song")

          // Check The song playlist (Support: apple music/youtube/spotify/soundcloud/deezer)
          const match = REGEX.some(function (match) {
            return match.test(url) == true;
          });

          async function checkRegex() {
            if (match == true) {
              let choice = []
              choice.push({ name: url, value: url })
              await interaction.respond(choice).catch(() => { });
            }
          }

          const Random = SEARCH_DEFAULT[Math.floor(Math.random() * SEARCH_DEFAULT.length)];

          if(interaction.commandName == "play") {
            checkRegex()
							let choice = []
							await yt.search(url || Random, { safeSearch: true, limit: 10 }).then(result => {
								result.forEach(x => { choice.push({ name: x.title, value: x.url }) })
							});
							return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "playskip") {
            checkRegex()
              let choice = []
              await yt.search(url || Random, { safeSearch: true, limit: 10 }).then(result => {
                  result.forEach(x => { choice.push({ name: x.title, value: x.url }) })
              });
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "playtop") {
            checkRegex()
              let choice = []
              await yt.search(url || Random, { safeSearch: true, limit: 10 }).then(result => {
                  result.forEach(x => { choice.push({ name: x.title, value: x.url }) })
              });
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "add") { 
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "delete") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "detail") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "import") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "private") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "public") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "savecurrent") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "savequeue") {
              const playlists = await Playlist.find({ owner: interaction.user.id });
              let choice = []
              playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.commandName == "playlist") {
              if (interaction.options.getSubcommand() == "remove") {
                  const playlists = await Playlist.find({ owner: interaction.user.id });
                  let choice = []
                  playlists.forEach(x => { choice.push({ name: x.name, value: x.name }) })
                  return await interaction.respond(choice).catch(() => { });
              }
          }
      }
    
      const command = client.slash.find(command => {
        switch (command.name.length) {
          case 1: return command.name[0] == interaction.commandName;
          case 2: return command.name[0] == interaction.commandName && command.name[1] == subCommandName;
          case 3: return command.name[0] == interaction.commandName && command.name[1] == subCommandGroupName && command.name[2] == subCommandName;
        }
      });
      if (!command) return;

      await client.addStats(command.name.at(-1), interaction);

      console.log(chalk.bgRed(`[COMMAND] ${interaction.user.tag} Used ${command.name.at(-1)} in ${interaction.guild.name} (${interaction.guild.id})`));

      //check default permission (must need)
      if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return interaction.user.dmChannel.send(`${client.i18n.get(language, "interaction", "bot_perms", {
        perms: "SendMessages"
      })}`);
      if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
      if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply({ content: `${client.i18n.get(language, "interaction", "bot_perms", {
        perms: "EmbedLinks"
      })}`, ephemeral: true }); 
      //check player in guild
      let player = client.manager.get(interaction.guild.id);
      if (command.settings.isPlayer && !player) {
        return interaction.reply({ content: `${client.i18n.get(language, "noplayer", "no_player")}`, ephemeral: true });
      }
      const { channel } = interaction.member.voice;
      //check in voice channel
      if (command.settings.inVoice) {
        if (!channel) return interaction.reply({ content: `${client.i18n.get(language, "noplayer", "no_voice")}`, ephemeral: true });
        // check bot perms in voice channel
        if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(command.permissions.channel || [])) {
          return interaction.reply({ content: `${client.i18n.get(language, "interaction", "bot_perms", {
            perms: command.permissions.bot.join(", ")
          })}`, ephemeral: true });
        }
      }
      //check same voice channel
      if (command.settings.sameVoice) {
        if (interaction.guild.members.me.voice.channel) {
          if (interaction.guild.members.me.voice.channel.id !== channel.id) {
            return interaction.reply({ content: `${client.i18n.get(language, "noplayer", "no_voice")}`, ephemeral: true });
          }
        }
        //check bot perms in voice channel
        if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(command.permissions.channel || [])) {
          return interaction.reply({ content: `${client.i18n.get(language, "interaction", "bot_perms", {
            perms: command.permissions.bot.join(", ")
          })}`, ephemeral: true });
        }
      }
      //check user premium
      if (command.settings.isPremium && !user.isPremium) {
        return interaction.reply({ content: `${client.i18n.get(language, "nopremium", "premium_desc")}`, ephemeral: true });
      }
      //check owner
      if (command.settings.isOwner && interaction.user.id !== client.owner) {
        return interaction.reply({ content: `${client.i18n.get(language, "interaction", "owner_only")}`, ephemeral: true });
      }
      //check bot permissions in guild
      if (!interaction.guild.members.me.permissions.has(command.permissions.bot || [])) {
        return interaction.reply({ content: `${client.i18n.get(language, "interaction", "bot_perms", {
          perms: command.permissions.bot.join(", ")
        })}`, ephemeral: true });
      }
      //check user permissions
      if (!interaction.member.permissions.has(command.permissions.user || [])) {
        return interaction.reply({ content: `${client.i18n.get(language, "interaction", "user_perms", {
          perms: command.permissions.user.join(", ")
        })}`, ephemeral: true });
      }

  if (command) {
      try {
          command.run(interaction, client, user, language, player);
      } catch (error) {
          await interaction.reply({ content: `${client.i18n.get(language, "interaction", "error")}`, ephmeral: true });
      }
    }

  }
}