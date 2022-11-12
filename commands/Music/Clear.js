const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "clear"],
    description: "Clear song in queue!",
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

        await player.queue.clear();
        
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "clearqueue_msg")}`)
            .setColor(client.color);
            
        return interaction.editReply({ embeds: [embed] });
    }
}