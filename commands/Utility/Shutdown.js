const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["utility", "shutdown"],
    description: "Shuts down the client!",
    category: "Utility",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: true,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "utilities", "restart_msg")}`)
            .setColor(client.color);
    
        await interaction.editReply({ embeds: [embed] });
                
        process.exit();
    }
}