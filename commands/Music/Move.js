const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "move"],
    description: "Change a songs position in a queue.",
    category: "Music",
    options: [
        {
            name: "from",
            description: "The queue number of the song",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "to",
            description: "The position in queue you want to move",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const tracks = interaction.options.getInteger("from");
        const position = interaction.options.getInteger("to");

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
