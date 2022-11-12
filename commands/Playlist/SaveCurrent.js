const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../settings/models/Playlist.js");

const tracks = [];

module.exports = {
    name: ["playlist", "savecurrent"],
    description: "Save the current song to a playlist",
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
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });

        const name = interaction.options.getString("name");
        const PName = name.replace(/_/g, ' ');

        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_owner")}`);

        const current = player.queue.current;

        tracks.push(current);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "savequeue_saved", {
                name: PName,
                tracks: 1
                })}`)
            .setColor(client.color)

        interaction.editReply({ embeds: [embed] });

        playlist.tracks.push(...tracks);

        playlist.save().then(() => {
            tracks.length = 0;
        }); 
    }
}