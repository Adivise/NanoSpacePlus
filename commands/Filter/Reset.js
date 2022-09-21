const { EmbedBuilder } = require('discord.js');
const delay = require("delay");

module.exports = {
    name: ["filter", "reset"],
    description: "Reset filter",
    category: "Filter",
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "reset_loading")}`);

        const player = client.manager.get(interaction.guild.id);
        if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        const data = {
            op: 'filters',
            guildId: interaction.guild.id,
        }

        await player.node.send(data);
        await player.setVolume(100);
        
        const resetted = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "reset_on")}`)
            .setColor(client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [resetted] });
        
    }
}