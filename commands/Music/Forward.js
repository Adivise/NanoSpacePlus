const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');

const forward = 10;

module.exports = {
    name: ["music", "forward"],
    description: "forward the currently playing song.",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "How many seconds to forward?",
            type: ApplicationCommandOptionType.Integer,
            required: false
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

        const value = interaction.options.getInteger("seconds");

        if (value && !isNaN(value)) {
            if((player.position + value * 1000) < player.queue.current.duration) {
                await player.seek(player.position + value * 1000);
                
                const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "forward_msg", {
                    duration: formatDuration(player.position)
                })}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });

            } else { 
                return interaction.editReply(`${client.i18n.get(language, "music", "forward_beyond")}`);
            }
        } else if (value && isNaN(value)) { 
            return interaction.editReply(`${client.i18n.get(language, "music", "forward_invalid", {
                prefix: "/"
            })}`);
        }

        if (!value) {
            if((player.position + forward * 1000) < player.queue.current.duration) {
                await player.seek(player.position + forward * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "forward_msg", {
                        duration: formatDuration(player.position)
                    })}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            } else {
                return interaction.editReply(`${client.i18n.get(language, "music", "forward_beyond")}`);
            }
        }
    }
}
