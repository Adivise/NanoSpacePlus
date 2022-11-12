const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = { 
    name: ["Context | Stop"],
    type: ApplicationCommandType.Message,
    category: "Context",
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

        const { channel } = message.member.voice;

        await player.destroy();
        await client.UpdateMusic(player);
        await client.clearInterval(client.interval);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "leave_msg", {
                channel: channel.name
            })}`)
            .setColor(client.color);

        return interaction.editReply({ embeds: [embed] });
    }
}