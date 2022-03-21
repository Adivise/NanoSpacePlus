const { MessageEmbed } = require('discord.js');
const GLang = require('../../settings/models/Language.js'); 

module.exports = { 
    name: "utilitie",
    description: "Utilitie Command!",
    options: [
        {
            name: "language",
            description: "Change the language for the bot",
            type: 1, /// SUBCOMMAND! = 1
            options: [
                {
                    name: "input",
                    description: "The new language",
                    required: true,
                    type: 3
                }
            ],
        },
        {
            name: "restart",
            description: "Shuts down the client!",
            type: 1 /// SUBCOMMMAND! = 1
        }
    ],
run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        ///// CHANGE LANGUAGE COMMAND!
        if (interaction.options.getSubcommand() === "language") {
            const input = interaction.options.getString("input");

            if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.editReply(`${client.i18n.get(language, "utilities", "lang_perm")}`);
            const languages = client.i18n.getLocales();
            if (!languages.includes(input)) return interaction.editReply(`${client.i18n.get(language, "utilities", "provide_lang", {
                languages: languages.join(', ')
            })}`);
    
            const newLang = await GLang.findOne({ guild: interaction.guild.id });
            if(!newLang) {
                const newLang = new GLang({
                    guild: interaction.guild.id,
                    language: input
                });
                newLang.save().then(() => {
                    const embed = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "utilities", "lang_set", {
                        language: input
                    })}`)
                    .setColor(client.color)
    
                    interaction.editReply({ content: " ", embeds: [embed] });
                }
                ).catch(() => {
                    interaction.editReply(`${client.i18n.get(language, "utilities", "Lang_error")}`);
                });
            }
            else if(newLang) {
                newLang.language = input;
                newLang.save().then(() => {
                    const embed = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "utilities", "lang_change", {
                        language: input
                    })}`)
                    .setColor(client.color)
        
                    interaction.editReply({ content: " ", embeds: [embed] });
                }
                ).catch(() => {
                    interaction.editReply(`${client.i18n.get(language, "utilities", "Lang_error")}`);
                });
            }
        }
        ///// RESTART COMMAND!
        if (interaction.options.getSubcommand() === "restart") {
            if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });

            const restart = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "utilities", "restart_msg")}`)
                .setColor(client.color);
        
            await interaction.editReply({ embeds: [restart] });
                    
            process.exit();
        }
    }
};