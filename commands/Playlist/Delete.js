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
            autocomplete: true
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const name = interaction.options.getString("name");
        const PName = name.replace(/_/g, ' ');

        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "delete_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "delete_owner")}`);

        await playlist.delete();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "delete_deleted", {
                name: PName
            })}`)
            .setColor(client.color)

        return interaction.editReply({ embeds: [embed] });
    }
}