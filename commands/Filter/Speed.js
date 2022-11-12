const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["filter", "speed"],
    description: "Sets the speed of the song.",
    category: "Filter",
    options: [
        {
            name: "amount",
            description: "The amount of speed to set the song to.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 0,
            max_value: 10
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: true,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });
        
        const value = interaction.options.getInteger('amount');

        const data = {
            op: 'filters',
            guildId: interaction.guild.id,
            timescale: { speed: value },
        }

        await player.node.send(data);

        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "speed_loading", {
            amount: value
        })}`);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "speed_on", {
                amount: value
            })}`)
            .setColor(client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}