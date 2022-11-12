const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    name: ["Context | Loop"],
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

		if (player.queueRepeat === true) {
            await player.setQueueRepeat(false)
            
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "unloopall")}`)
                .setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
		}
		else {
            await player.setQueueRepeat(true);
            
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "loopall")}`)
                .setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
		}
	}
};