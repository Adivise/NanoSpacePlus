const { EmbedBuilder } = require('discord.js');
const delay = require("delay");

module.exports = {
    name: ["filter", "darthvader"],
    description: "Turning on darthvader filter",
    category: "Filter",
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
            name: "darthvader"
            })}`);

            const player = client.manager.get(interaction.guild.id);
            if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
                timescale: {
                    speed: 0.975,
                    pitch: 0.5,
                    rate: 0.8
                },
            }
    
            await player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                name: "darthvader"
            })}`)
            .setColor(client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });

    }
}