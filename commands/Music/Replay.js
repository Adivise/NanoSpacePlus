const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "replay"],
    description: "Replay the current song!",
    category: "Music",
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

        await player.seek(0);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "replay_msg")}`)
            .setColor(client.color);

        return interaction.editReply({ embeds: [embed] });
    }
}