const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "pause"],
    description: "Pause the music!",
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
        
        await player.pause(player.playing);
        const Emojis = player.paused ? `${client.i18n.get(language, "music", "pause_switch_pause")}` : `${client.i18n.get(language, "music", "pause_switch_resume")}`;

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "pause_msg", {
                pause: Emojis
            })}`)
            .setColor(client.color);

        return interaction.editReply({ embeds: [embed] });
    }
}