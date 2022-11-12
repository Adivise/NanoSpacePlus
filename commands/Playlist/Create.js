const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../settings/models/Playlist.js");

module.exports = {
    name: ["playlist", "create"],
    description: "Create a new playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
            mix_length: 3,
            max_length: 16
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
        if(playlist) return msg.edit(`${client.i18n.get(language, "playlist", "create_name_exist")}`);

        const Limit = await Playlist.find({ owner: interaction.user.id }).countDocuments();
        if(Limit >= client.config.LIMIT_PLAYLIST) return msg.edit(`${client.i18n.get(language, "playlist", "create_limit_playlist", {
            limit: client.config.LIMIT_PLAYLIST
        })}`);

        const create = new Playlist({
            name: PName,
            owner: interaction.user.id,
            tracks: [],
            private: true,
            created: Date.now()
        });

        create.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "create_created", {
                    playlist: PName
                    })}`)
                .setColor(client.color)
            interaction.editReply({ embeds: [embed] });
        });
    }       
}