const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');

const fastForwardNum = 10;

module.exports = {
    name: ["music", "forward"],
    description: "forward the currently playing song.",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "example 10s, 20s, 40s",
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.getInteger("seconds");
        const msg = await interaction.channel.send(`${client.i18n.get(language, "music", "forward_loading")}`);
            
        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);

        if (value && !isNaN(value)) {
            if((player.position + value * 1000) < song.duration) {

                player.seek(player.position + value * 1000);
                
                const forward1 = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "forward_msg", {
                    duration: CurrentDuration
                })}`)
                .setColor(client.color);

                msg.edit({ content: " ", embeds: [forward1] });

            } else { 
                return msg.edit(`${client.i18n.get(language, "music", "forward_beyond")}`);
            }
        }
        else if (value && isNaN(value)) { 
            return msg.edit(`${client.i18n.get(language, "music", "forward_invalid", {
                prefix: "/"
            })}`);
        }

        if (!value) {
            if((player.position + fastForwardNum * 1000) < song.duration) {
                player.seek(player.position + fastForwardNum * 1000);
                
                const forward2 = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "forward_msg", {
                    duration: CurrentDuration
                })}`)
                .setColor(client.color);

                msg.edit({ content: " ", embeds: [forward2] });

            } else {
                return msg.edit(`${client.i18n.get(language, "music", "forward_beyond")}`);
            }
        }
    }
}
