const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: ["music", "join"],
    description: "Summon the bot to your voice channel.",
    category: "Music",
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "join_loading")}`);

        const { channel } = interaction.member.voice;
        if(!channel) return msg.edit(`${client.i18n.get(language, "music", "join_voice")}`);
        if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Connect)) return msg.edit(`${client.i18n.get(language, "music", "play_join")}`);
        if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Speak)) return msg.edit(`${client.i18n.get(language, "music", "play_speak")}`);

        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true,
        });

        await player.connect();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "join_msg", {
                channel: channel.name
            })}`)
            .setColor(client.color)

        msg.edit({ content: " ", embeds: [embed] })
        
    }
}
