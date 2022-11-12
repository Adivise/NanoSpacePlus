const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["music", "skipto"],
    description: "Skips to a certain song in the queue.",
    category: "Music",
    options: [
        {
            name: "position",
            description: "The position of the song in the queue.",
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
        
        const value = interaction.options.getInteger("position");
        if (value === 0) return interaction.editReply(`${client.i18n.get(language, "music", "skipto_arg", {
            prefix: "/"
        })}`);

        if ((value > player.queue.length) || (value && !player.queue[value - 1])) return interaction.editReply(`${client.i18n.get(language, "music", "skipto_invalid")}`);
        if (value == 1) player.stop();

        await player.queue.splice(0, value - 1);
        await player.stop();
        await client.clearInterval(client.interval);
        
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "skipto_msg", {
                position: value
            })}`)
            .setColor(client.color);

        return interaction.editReply({ embeds: [embed] });       
    }
}