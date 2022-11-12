const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../settings/models/Playlist.js");

module.exports = {
    name: ["playlist", "private"],
    description: "Private a playlist",
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
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_owner")}`);

        const Private = await Playlist.findOne({ name: PName, private: true });
        if(Private) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_already")}`);

        playlist.private = true;

        playlist.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "private_success")}`)
                .setColor(client.color)
            interaction.editReply({ embeds: [embed] });
        });
    }
}