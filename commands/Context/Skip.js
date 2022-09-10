const { ContextMenuInteraction, EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = { 
    name: "Context | Skip",
    type: ApplicationCommandType.Message,
    /**
     * @param {ContextMenuInteraction} interaction
     */
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "skip_loading")}`);

		const player = client.manager.get(interaction.guild.id);
		if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        if (player.queue.size == 0) {
            await player.destroy();
            await client.UpdateMusic(player);

            const skipped = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [skipped] });
        } else {
            await player.stop();

            const skipped = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [skipped] });
        }
    }
}