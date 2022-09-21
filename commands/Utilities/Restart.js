const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["utilities", "restart"],
    description: "Shuts down the client!",
    category: "Utilities",
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "utilities", "restart_msg")}`)
            .setColor(client.color);
    
        await interaction.editReply({ embeds: [embed] });
                
        process.exit();
    }
}