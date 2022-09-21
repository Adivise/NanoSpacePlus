const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    name: ["music", "remove"],
    description: "Remove song from queue!",
    category: "Music",
    options: [
        {
            name: "position",
            description: "The position in queue want to remove.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const tracks = interaction.options.getInteger("position");

        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "move_loading")}`);
        
        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        if (tracks == 0) return msg.edit(`${client.i18n.get(language, "music", "removetrack_already")}`);
        if (tracks > player.queue.length) return msg.edit(`${client.i18n.get(language, "music", "removetrack_notfound")}`);

        const song = player.queue[tracks - 1];

        player.queue.splice(tracks - 1, 1);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "removetrack_desc", {
                name: song.title,
                url: song.uri,
                duration: convertTime(song.duration, true),
                request: song.requester
            })
        }`)

        return msg.edit({ content: " ", embeds: [embed] });
    }
}