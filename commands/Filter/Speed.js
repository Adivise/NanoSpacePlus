const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const delay = require("delay");

module.exports = {
    name: ["filter", "speed"],
    description: "Sets the speed of the song.",
    category: "Filter",
    options: [
        {
            name: "amount",
            description: "The amount of speed to set the song to.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const value = interaction.options.getInteger('amount');

        const player = client.manager.get(interaction.guild.id);
        if(!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
        if (value < 0) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_greater")}`);
        if (value > 10) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_less")}`);

        const data = {
            op: 'filters',
            guildId: interaction.guild.id,
            timescale: { speed: value },
        }

        await player.node.send(data);

        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "speed_loading", {
            amount: value
            })}`);
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "speed_on", {
                amount: value
            })}`)
            .setColor(client.color);
        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    
    }
}