const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');

const rewindNum = 10;

module.exports = {
    name: ["music", "rewind"],
    description: "Rewind timestamp in the song!",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "Rewind timestamp in the song!",
            type: ApplicationCommandOptionType.Integer,
            required: false,
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
        const CurrentDuration = formatDuration(player.position);

        if(value && !isNaN(value)) {
            if((player.position - value * 1000) > 0) {
                await player.seek(player.position - value * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "rewind_msg", {
                        duration: CurrentDuration,
                    })}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            } else {
                return interaction.editReply(`${client.i18n.get(language, "music", "rewind_beyond")}`);
            }
        } else if(value && isNaN(value)) {
            return interaction.editReply(`${client.i18n.get(language, "music", "rewind_invalid", {
                prefix: "/"
            })}`);
        }

        if(!value) {
            if((player.position - rewindNum * 1000) > 0) {
                await player.seek(player.position - rewindNum * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "rewind_msg", {
                        duration: CurrentDuration,
                    })}`)
                    .setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            } else {
                return interaction.editReply(`${client.i18n.get(language, "music", "rewind_beyond")}`);
            }
        }
    }
}