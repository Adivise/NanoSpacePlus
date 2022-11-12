const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const GLang = require('../../settings/models/Language.js'); 

module.exports = {
    name: ["utility", "language"],
    description: "Change the language for the bot",
    category: "Utility",
    options: [
        {
            name: "input",
            description: "The new language",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: ["ManageGuild"],
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const input = interaction.options.getString("input");

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
                const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "utilities", "lang_set", {
                    language: input
                })}`)
                .setColor(client.color)

                interaction.editReply({ content: " ", embeds: [embed] });
            }
            ).catch(() => {
                interaction.editReply(`${client.i18n.get(language, "utilities", "Lang_error")}`);
            });
        } else if(newLang) {
            newLang.language = input;
            newLang.save().then(() => {
                const embed = new EmbedBuilder()
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
}