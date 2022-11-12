const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["filter", "reset"],
    description: "Reset filter",
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

        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "reset_loading")}`);

        const data = {
            op: 'filters',
            guildId: interaction.guild.id,
        }

        await player.node.send(data);
        await player.setVolume(100);
        
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "reset_on")}`)
            .setColor(client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}