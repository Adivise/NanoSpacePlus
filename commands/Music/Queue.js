const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');
const { SlashPage } = require('../../structures/PageQueue.js');

module.exports = {
    name: ["queue"], // I move play to main issues subcmd (max 25)
    description: "Show the queue of songs.",
    category: "Music",
    options: [
        {
            name: "page",
            description: "Page number to show.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: true,
        isOwner: false,
        inVoice: false,
        sameVoice: true,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });

        const song = player.queue.current;
        const qduration = `${formatDuration(player.queue.duration)}`;

        let pagesNum = Math.ceil(player.queue.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
            const song = player.queue[i];
            songStrings.push(
                `**${i + 1}.** [${song.title}](${song.uri}) \`[${formatDuration(song.duration)}]\` • ${song.requester}
                `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = songStrings.slice(i * 10, i * 10 + 10).join('');

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "music", "queue_author", {
                    guild: interaction.guild.name,
                })}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "music", "queue_description", {
                    title: song.title,
                    url: song.uri,
                    duration: formatDuration(song.duration),
                    request: song.requester,
                    rest: str == '' ? '  Nothing' : '\n' + str,
                })}`)
                .setFooter({ text: `${client.i18n.get(language, "music", "queue_footer", {
                    page: i + 1,
                    pages: pagesNum,
                    queue_lang: player.queue.length,
                    duration: qduration,
                })}` });

                if (song.thumbnail) {
                    embed.setThumbnail(`https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`);
                } else {
                    embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
                }

            pages.push(embed);
        }
        
        const value = interaction.options.getInteger("page");
        if (!value) {
            if (pages.length == pagesNum && player.queue.length > 10) SlashPage(client, interaction, pages, 60000, player.queue.length, qduration, language);
            else return interaction.editReply({ embeds: [pages[0]] });
        } else {
            if (isNaN(value)) return interaction.editReply(`${client.i18n.get(language, "music", "queue_notnumber")}`);
            if (value > pagesNum) return interaction.editReply(`${client.i18n.get(language, "music", "queue_page_notfound", {
                page: pagesNum,
            })}`);
            const pageNum = value == 0 ? 1 : value - 1;
            return interaction.editReply({ embeds: [pages[pageNum]] });
        }
    }
}