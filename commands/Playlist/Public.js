const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../settings/models/Playlist.js");

module.exports = {
    name: ["playlist", "public"],
    description: "Public a playlist",
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
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "public_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "public_owner")}`);

        const Public = await Playlist.findOne({ name: PName, private: false });
        if(Public) return interaction.editReply(`${client.i18n.get(language, "playlist", "public_already")}`);

        playlist.private = false;

        playlist.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "public_success")}`)
                .setColor(client.color)
            interaction.editReply({ embeds: [embed] });
        });
    }
}