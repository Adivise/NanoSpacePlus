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
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: true,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });

        const tracks = interaction.options.getInteger("position");
        if (tracks == 0) return interaction.editReply(`${client.i18n.get(language, "music", "removetrack_already")}`);
        if (tracks > player.queue.length) return interaction.editReply(`${client.i18n.get(language, "music", "removetrack_notfound")}`);

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

        return interaction.editReply({ embeds: [embed] });
    }
}