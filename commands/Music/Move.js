const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "move"],
    description: "Move position song in queue!",
    category: "Music",
    options: [
        {
            name: "queue",
            description: "The queue of the song",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "position",
            description: "The position in queue want to move too.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const tracks = interaction.options.getInteger("queue");
        const position = interaction.options.getInteger("position");

        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "move_loading")}`);
        
        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        if (tracks == 0 && position == 0) return msg.edit(`${client.i18n.get(language, "music", "move_already")}`);
        if (tracks > player.queue.length || (tracks && !player.queue[tracks - 1])) return msg.edit(`${client.i18n.get(language, "music", "move_notfound")}`);
        if ((position > player.queue.length) || !player.queue[position - 1]) return msg.edit(`${client.i18n.get(language, "music", "move_notfound")}`);

        const song = player.queue[tracks - 1];

        player.queue.splice(tracks - 1, 1);
        player.queue.splice(position - 1, 0, song);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "move_desc", {
                name: song.title,
                url: song.uri,
                pos: position
            })
        }`)

        return msg.edit({ content: " ", embeds: [embed] });
    }
}