const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../settings/models/Playlist.js");

module.exports = {
    name: ["playlist", "delete"],
    description: "Delete a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        try {
            if (user && user.isPremium) {
                const value = interaction.options.getString("name");

                const Plist = value.replace(/_/g, ' ');
    
                const playlist = await Playlist.findOne({ name: Plist });
                if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "delete_notfound")}`);
                if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "delete_owner")}`);
    
                await playlist.delete();
    
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "delete_deleted", {
                        name: Plist
                        })}`)
                    .setColor(client.color)
    
                interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${client.i18n.get(language, "nopremium", "premium_author")}`, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`${client.i18n.get(language, "nopremium", "premium_desc")}`)
                    .setColor(client.color)
                    .setTimestamp()

                return interaction.editReply({ content: " ", embeds: [embed] });
            }
        } catch (err) {
            console.log(err);
            interaction.editReply({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
        }
    }
}