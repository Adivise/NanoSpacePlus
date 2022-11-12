const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "skip"],
    description: "Skips the song currently playing.",
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
        
        if (player.queue.size == 0) {
            await player.destroy();
            await client.UpdateMusic(player);
            await client.clearInterval(client.interval);

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.stop();
            await client.clearInterval(client.interval);

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            return interaction.editReply({ embeds: [embed] });
        }
    }
}