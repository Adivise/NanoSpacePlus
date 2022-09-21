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
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "rewind_loading")}`);
        const value = interaction.options.getInteger("seconds");

        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        const CurrentDuration = formatDuration(player.position);

        if(value && !isNaN(value)) {
            if((player.position - value * 1000) > 0) {
                await player.seek(player.position - value * 1000);
                
                const rewind1 = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "rewind_msg", {
                    duration: CurrentDuration,
                })}`)
                .setColor(client.color);

                msg.edit({ content: " ", embeds: [rewind1] });
            } else {
                return msg.edit(`${client.i18n.get(language, "music", "rewind_beyond")}`);
            }
        } else if(value && isNaN(value)) {
            return msg.edit(`${client.i18n.get(language, "music", "rewind_invalid", {
                prefix: "/"
            })}`);
        }

        if(!value) {
            if((player.position - rewindNum * 1000) > 0) {
                await player.seek(player.position - rewindNum * 1000);
                
                const rewind2 = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "rewind_msg", {
                    duration: CurrentDuration,
                })}`)
                .setColor(client.color);

                msg.edit({ content: " ", embeds: [rewind2] });
            } else {
                return msg.edit(`${client.i18n.get(language, "music", "rewind_beyond")}`);
            }
        }
    }
}