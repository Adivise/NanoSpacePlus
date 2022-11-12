const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: ["music", "247"],
    description: "24/7 in voice channel",
    category: "Music",
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

        if (player.twentyFourSeven) {
            player.twentyFourSeven = false;

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "247_off")}`)
                .setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        } else {
            player.twentyFourSeven = true;

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "247_on")}`)
                .setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        }
    }
}