const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');
const { SlashPage } = require('../../structures/PageQueue.js');
const Playlist = require("../../settings/models/Playlist.js");

module.exports = {
    name: ["playlist", "detail"],
    description: "Detail a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "page",
            description: "The page you want to view",
            required: false,
            type: ApplicationCommandOptionType.Integer,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        try {
            if (user && user.isPremium) {
                const value = interaction.options.getString("name");
                const number = interaction.options.getInteger("page");
        
                const Plist = value.replace(/_/g, ' ');
                const playlist = await Playlist.findOne({ name: Plist });
                if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_notfound")}`);
                if(playlist.private && playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_private")}`);
        
                let pagesNum = Math.ceil(playlist.tracks.length / 10);
                if(pagesNum === 0) pagesNum = 1;
        
                const playlistStrings = [];
                for(let i = 0; i < playlist.tracks.length; i++) {
                    const playlists = playlist.tracks[i];
                    playlistStrings.push(
                        `${client.i18n.get(language, "playlist", "detail_track", {
                            num: i + 1,
                            title: playlists.title,
                            url: playlists.uri,
                            author: playlists.author,
                            duration: formatDuration(playlists.duration)
                        })}
                        `);
                }
        
                const totalDuration = formatDuration(playlist.tracks.reduce((acc, cur) => acc + cur.duration, 0));
        
                const pages = [];
                for (let i = 0; i < pagesNum; i++) {
                    const str = playlistStrings.slice(i * 10, i * 10 + 10).join('');
                    const embed = new EmbedBuilder() //${playlist.name}'s Playlists
                        .setAuthor({ name: `${client.i18n.get(language, "playlist", "detail_embed_title", {
                            name: playlist.name
                        })}`, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                        .setColor(client.color) //Page • ${i + 1}/${pagesNum} | ${playlist.tracks.length} • Songs | ${totalDuration} • Total duration
                        .setFooter({ text: `${client.i18n.get(language, "playlist", "detail_embed_footer", {
                            page: i + 1,
                            pages: pagesNum,
                            songs: playlist.tracks.length,
                            duration: totalDuration
                        })}` });
        
                    pages.push(embed);
                }

                if (!number) {
                    if (pages.length == pagesNum && playlist.tracks.length > 10) SlashPage(client, interaction, pages, 60000, playlist.tracks.length, totalDuration, language);
                    else return interaction.editReply({ embeds: [pages[0]] });
                } else {
                    if (isNaN(number)) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_notnumber")}`);
                    if (number > pagesNum) return interaction.editReply(`${client.i18n.get(language, "playlist", "detail_page_notfound", {
                        page: pagesNum
                    })}`);
                    const pageNum = number == 0 ? 1 : number - 1;
                    return interaction.editReply({ embeds: [pages[pageNum]] });
                }
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