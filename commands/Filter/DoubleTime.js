const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["filter", "doubletime"],
    description: "Turning on doubletime filter",
    category: "Filter",
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
        
        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
            name: "doubletime"
        })}`);

        const data = {
            op: 'filters',
            guildId: interaction.guild.id,
            timescale: {
                speed: 1.165,
            },
        }

        await player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                name: "doubletime"
            })}`)
            .setColor(client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}