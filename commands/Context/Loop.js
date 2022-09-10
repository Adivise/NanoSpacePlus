const { ContextMenuInteraction, EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    name: "Context | Loop",
    type: ApplicationCommandType.Message,
    /**
     * @param {ContextMenuInteraction} interaction
     */
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
		const msg = await interaction.editReply(`${client.i18n.get(language, "music", "loopall_loading")}`);

		const player = client.manager.get(interaction.guild.id);
		if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

		if (player.queueRepeat === true) {
            player.setQueueRepeat(false)
            
            const unloopall = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "unloopall")}`)
                .setColor(client.color);

            return msg.edit({ content: ' ', embeds: [unloopall] });
		}
		else {
            player.setQueueRepeat(true);
            
            const loopall = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "loopall")}`)
                .setColor(client.color);

            return msg.edit({ content: ' ', embeds: [loopall] });
		}
	}
};