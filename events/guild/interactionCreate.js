const { Permissions } = require("discord.js");
const GLang = require("../../settings/models/Language.js");
const chalk = require('chalk');
const Premium = require("../../settings/models/Premium.js");

module.exports = async(client, interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
        if (!client.slash.has(interaction.commandName)) return;
        if (!interaction.guild) return;

        let LANGUAGE = client.i18n;

		let guildModel = await GLang.findOne({ guild: interaction.guild.id });
        if(guildModel && guildModel.language) LANGUAGE = guildModel.language;

        const language = LANGUAGE;

        const command = client.slash.get(interaction.commandName);
        if(!command) return;
        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`${client.i18n.get(language, "interaction", "dev_only")}`); 
            console.log(chalk.bgRedBright(`[INFOMATION] ${interaction.user.tag} trying request the command from ${interaction.guild.name} (${interaction.guild.id})`)); 
            return;
        }

        console.log(chalk.magenta(`[COMMAND] ${command.name} used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`));

        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return interaction.user.dmChannel.send(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) return;
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.SPEAK)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.CONNECT)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return await interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);

        if (command) {
            let user = interaction.client.premiums.get(interaction.user.id)
        
            if (!user) {
                const findUser = await Premium.findOne({ Id: interaction.user.id })
                if (!findUser) {
                    const newUser = await Premium.create({ Id: interaction.user.id })
                    interaction.client.premiums.set(interaction.user.id, newUser)
                    user = newUser
                } else return
            } 
        try {
            command.run(interaction, client, user, language);
        } catch (error) {
            console.log(error)
            await interaction.reply({ content: `${client.i18n.get(language, "interaction", "error")}`, ephmeral: true });
        }}
    }
}