const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const delay = require("delay");

module.exports = {
    name: ["filter", "equalizer"],
    description: 'Custom Equalizer!',
    category: "Filter",
    options: [
        {
            name: 'bands',
            description: 'Number of bands to use (max 14 bands.)',
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        try {
            if (user && user.isPremium) {
            const value = interaction.options.getString('bands');

            const player = client.manager.get(interaction.guild.id);
            if(!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
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
            }
            else if (value == 'off' || value == 'reset') {
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
        } else {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "nopremium", "premium_author")}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`${client.i18n.get(language, "nopremium", "premium_desc")}`)
                .setColor(client.color)
                .setTimestamp()
    
            return interaction.editReply({ content: " ", embeds: [embed] });
            }
        } catch (err) {
            console.log(err)
            interaction.editReply({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
        }
    }
}