const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = { 
    name: "Context | Shuffle",
    type: 3,
    /**
     * @param {ContextMenuInteraction} interaction
     */
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "shuffle_loading")}`);

		const player = client.manager.get(interaction.guild.id);
		if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

		await player.queue.shuffle();

        const shuffle = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "music", "shuffle_msg")}`)
            .setColor(client.color);
        
        msg.edit({ content: " ", embeds: [shuffle] });
    }
}