const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { SlashPlaylist } = require('../../structures/PageQueue.js');
const Playlist = require("../../settings/models/Playlist.js");
const humanizeDuration = require('humanize-duration');

module.exports = {
    name: ["playlist", "view"],
    description: "View your playlists",
    category: "Playlist",
    options: [
        {
            name: "page",
            description: "The page you want to view",
            required: false,
            type: ApplicationCommandOptionType.Integer
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

        const number = interaction.options.getInteger("page");

        const playlists = await Playlist.find({ owner: interaction.user.id });

        let pagesNum = Math.ceil(playlists.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        const tracks = [];
        for(let i = 0; i < playlists.length; i++) {
            const playlist = playlists[i];
            const created = humanizeDuration(Date.now() - playlists[i].created, { largest: 1 })
            tracks.push(
                `${client.i18n.get(language, "playlist", "view_embed_playlist", {
                    num: i + 1,
                    name: playlist.name,
                    tracks: playlist.tracks.length,
                    create: created
                })}
                `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = tracks.slice(i * 10, i * 10 + 10).join('');
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "playlist", "view_embed_title", {
                    user: interaction.user.username
                })}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                .setColor(client.color)
                .setFooter({ text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
                    page: i + 1,
                    pages: pagesNum,
                    songs: playlists.length
                })}` });

            pages.push(embed);
        }
        if (!number) {
            if (pages.length == pagesNum && playlists.length > 10) SlashPlaylist(client, interaction, pages, 30000, playlists.length, language);
            else return interaction.editReply({ embeds: [pages[0]] });
        } else {
            if (isNaN(number)) return interaction.editReply({ content: `${client.i18n.get(language, "playlist", "view_notnumber")}` });
            if (number > pagesNum) return interaction.editReply({ content: `${client.i18n.get(language, "playlist", "view_page_notfound", {
                page: pagesNum
            })}` });
            const pageNum = number == 0 ? 1 : number - 1;
            return interaction.editReply({ embeds: [pages[pageNum]] });
        }
    }
}