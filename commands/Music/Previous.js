const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "previous"],
    description: "Play the previous song in the queue.",
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
        
        if (!player.queue.previous) return interaction.editReply(`${client.i18n.get(language, "music", "previous_notfound")}`);

        await player.queue.unshift(player.queue.previous);
        await player.stop();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "previous_msg")}`)
            .setColor(client.color);

        return interaction.editReply({ embeds: [embed] });
    }
}