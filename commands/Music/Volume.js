const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "volume"],
    description: "Adjusts the volume of the bot.",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "The amount of volume to set the bot to.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
            min_value: 1,
            max_value: 100
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
        
        const value = interaction.options.getInteger("amount");
        if (!value) return interaction.editReply(`${client.i18n.get(language, "music", "volume_usage", {
            volume: player.volume
        })}`);

        await player.setVolume(Number(value));

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "volume_msg", {
                volume: value
            })}`)
            .setColor(client.color);
        
        return interaction.editReply({ embeds: [embed] });
    }
}