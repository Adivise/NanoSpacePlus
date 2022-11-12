const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["filter", "vaporwave"],
    description: "Turning on vaporwave filter",
    category: "Filter",
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

        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
            name: "vaporwave"
        })}`);

        const data = {
            op: 'filters',
            guildId: interaction.guild.id,
            equalizer: [
                { band: 0, gain: 0 },
                { band: 1, gain: 0 },
                { band: 2, gain: 0 },
                { band: 3, gain: 0 },
                { band: 4, gain: 0 },
                { band: 5, gain: 0 },
                { band: 6, gain: 0 },
                { band: 7, gain: 0 },
                { band: 8, gain: 0.15 },
                { band: 9, gain: 0.15 },
                { band: 10, gain: 0.15 },
                { band: 11, gain: 0.15 },
                { band: 12, gain: 0.15 },
                { band: 13, gain: 0.15 },
            ],
            timescale: {
                pitch: 0.55,
            },
        }

        await player.node.send(data);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                name: "vaporwave"
            })}`)
            .setColor(client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}