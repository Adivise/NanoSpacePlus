const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "skip"],
    description: "Skips the song currently playing.",
    category: "Music",
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
            await client.clearInterval(client.interval);

            const skipped = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [skipped] });
        } else {
            await player.stop();
            await client.clearInterval(client.interval);

            const skipped = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [skipped] });
        }
    }
}