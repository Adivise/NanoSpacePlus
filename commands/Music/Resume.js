const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "resume"],
    description: "Resume the music!",
    category: "Music",
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "resume_loading")}`);

        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
        await player.pause(player.playing);
        const uni = player.paused ? `${client.i18n.get(language, "music", "resume_switch_pause")}` : `${client.i18n.get(language, "music", "resume_switch_resume")}`;

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "resume_msg", {
                resume: uni
            })}`)
            .setColor(client.color);

        msg.edit({ content: " ", embeds: [embed] });
        
    }
}