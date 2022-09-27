const { PermissionsBitField, InteractionType } = require("discord.js");
const GLang = require("../../settings/models/Language.js");
const chalk = require('chalk');
const { SEARCH_DEFAULT } = require("../../settings/config.js")
const yt = require("youtube-sr").default;

module.exports = async(client, interaction) => {
    if (interaction.isCommand || interaction.isContextMenuCommand || interaction.isModalSubmit || interaction.isChatInputCommand) {
        if (!interaction.guild) return;

        /// Create database when not have!
        await client.createSetup(interaction.guild.id);
        await client.createLang(interaction.guild.id);

        /// Create new member!
        const user = interaction.client.premiums.get(interaction.user.id);
        await client.createPremium(interaction, user);

		    const Lang = await GLang.findOne({ guild: interaction.guild.id });
        const language = Lang.language;

        let subCommandName = "";
        try {
          subCommandName = interaction.options.getSubcommand();
        } catch { };
        let subCommandGroupName = "";
        try {
          subCommandGroupName = interaction.options.getSubcommandGroup();
        } catch { };

        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
          const Random = SEARCH_DEFAULT[Math.floor(Math.random() * SEARCH_DEFAULT.length)];
          if(interaction.commandName == "play") {
              let choice = []
              await yt.search(interaction.options.getString("song") || Random, { safeSearch: true, limit: 10 }).then(result => {
                  result.forEach(x => { choice.push({ name: x.title, value: x.url }) })
              });
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "playskip") {
              let choice = []
              await yt.search(interaction.options.getString("song") || Random, { safeSearch: true, limit: 10 }).then(result => {
                  result.forEach(x => { choice.push({ name: x.title, value: x.url }) })
              });
              return await interaction.respond(choice).catch(() => { });
          } else if (interaction.options.getSubcommand() == "playtop") {
              let choice = []
              await yt.search(interaction.options.getString("song") || Random, { safeSearch: true, limit: 10 }).then(result => {
                  result.forEach(x => { choice.push({ name: x.title, value: x.url }) })
              });
              return await interaction.respond(choice).catch(() => { });
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
        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`${client.i18n.get(language, "interaction", "dev_only")}`); 
            console.log(`[COMMAND] ${interaction.user.tag} trying request the command from ${interaction.guild.name} (${interaction.guild.id})`); 
            return;
        }

        const msg_cmd = [
          `[COMMAND] ${command.name[0]}`,
          `${command.name[1] || ""}`,
          `${command.name[2] || ""}`,
          `used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`,
        ]

        console.log(chalk.bgRed(`${msg_cmd.join(" ")}`));

        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return interaction.user.dmChannel.send(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);

    if (command) {
        try {
            command.run(interaction, client, user, language);
        } catch (error) {
            console.log(error)
            await interaction.reply({ content: `${client.i18n.get(language, "interaction", "error")}`, ephmeral: true });
        }}
    }


}