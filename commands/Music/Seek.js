const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');

module.exports = {
    name: ["music", "seek"],
    description: "Seek timestamp in the song!",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "The number of seconds to seek the timestamp by.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const value = interaction.options.getInteger("seconds");
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "seek_loading")}`);
        
        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        if(value * 1000 >= player.playing.length || value < 0) return msg.edit(`${client.i18n.get(language, "music", "seek_beyond")}`);
        await player.seek(value * 1000);

        const Duration = formatDuration(player.position);

        const seeked = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "seek_msg", {
                duration: Duration
            })}`)
            .setColor(client.color);

        msg.edit({ content: ' ', embeds: [seeked] });

    }
}