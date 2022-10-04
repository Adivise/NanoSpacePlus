const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../settings/models/Playlist.js");

module.exports = {
    name: ["playlist", "remove"],
    description: "Remove a song from a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "postion",
            description: "The position of the song",
            required: true,
            type: ApplicationCommandOptionType.Integer
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        try {
            if (user && user.isPremium) {
                const value = interaction.options.getString("name");
                const pos = interaction.options.getInteger("postion");
        
                const Plist = value.replace(/_/g, ' ');
    
                const playlist = await Playlist.findOne({ name: Plist });
                if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "remove_notfound")}`);
                if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "remove_owner")}`);
            
                const position = pos;
                const song = playlist.tracks[position];
                if(!song) return interaction.editReply(`${client.i18n.get(language, "playlist", "remove_song_notfound")}`);
    
                playlist.tracks.splice(position - 1, 1);
                await playlist.save();
    
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "playlist", "remove_removed", {
                        name: Plist,
                        position: pos
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