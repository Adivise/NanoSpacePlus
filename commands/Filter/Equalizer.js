const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["filter", "equalizer"],
    description: 'Custom Equalizer!',
    category: "Filter",
    options: [
        {
            name: 'bands',
            description: 'Number of bands to use (max 14 bands.)',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: true,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });
        
        const value = interaction.options.getString('bands');

        if (!value) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "filters", "eq_author")}`, iconURL: `${client.i18n.get(language, "filters", "eq_icon")}` })
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "filters", "eq_desc")}`)
                .addFields({ name: `${client.i18n.get(language, "filters", "eq_field_title")}`, value: `${client.i18n.get(language, "filters", "eq_field_value", {
                    prefix: "/"
                })}`, inline: false })
                .setFooter({ text: `${client.i18n.get(language, "filters", "eq_footer", {
                    prefix: "/"
                })}` })
            return interaction.editReply({ embeds: [embed] });
        } else if (value == 'off' || value == 'reset') {
            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
            }
            return player.node.send(data);
        }

        const bands = value.split(/[ ]+/);
        let bandsStr = '';
        for (let i = 0; i < bands.length; i++) {
            if (i > 13) break;
            if (isNaN(bands[i])) return interaction.editReply(`${client.i18n.get(language, "filters", "eq_number", {
                num: i + 1
            })}`);
            if (bands[i] > 10) return interaction.editReply(`${client.i18n.get(language, "filters", "eq_than", {
                num: i + 1
            })}`);
        }

        for (let i = 0; i < bands.length; i++) {
            if (i > 13) break;
            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
                equalizer: [
                    { band: i, gain: (bands[i]) / 10 },
                ]
            }
            player.node.send(data);
            bandsStr += `${bands[i]} `;
        }
    
        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "eq_loading", {
            bands: bandsStr
        })}`);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "eq_on", {
                bands: bandsStr
                })}`)
            .setColor(client.color);

        await delay(2000);
        return msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}