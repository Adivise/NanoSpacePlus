const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "loop"],
    description: "Loops the current song!",
    category: "Music",
    options: [
        {
            name: "mode",
            description: "What mode do you want to loop?",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Current 🔂",
                    value: "current"
                },
                {
                    name: "Queue 🔁",
                    value: "queue"
                }
            ]
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

        const choice = interaction.options.getString("mode");
 
        if(choice === "current") {
            if (player.trackRepeat === false) {
                await player.setTrackRepeat(true);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "loop_current")}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            } else {
                await player.setTrackRepeat(false);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "unloop_current")}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            }
        } else if(choice === "queue") {
            if (player.queueRepeat === true) {
                await player.setQueueRepeat(false);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "unloop_all")}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            } else {
                await player.setQueueRepeat(true);

                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "loop_all")}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            }
        }
    }
}
