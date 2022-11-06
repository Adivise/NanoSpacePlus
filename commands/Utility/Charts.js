const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Chart = require("../../settings/models/GuildChart.js");
const GChart = require("../../settings/models/GlobalChart.js");

module.exports = {
    name: ["charts"], // The name of the command
    description: "Display Top 10 songs of the (global/guild)", // The description of the command (for help text)
    category: "Utility",
    options: [
        {
            name: 'choice',
            description: 'The type of chart you want to see',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'Global 🌐',
                    value: 'global',
                },
                {
                    name: 'Guild 💾',
                    value: 'guild',
                },
            ],
        },
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false});

        const choice = interaction.options.getString('choice');

        if (choice === 'global') {
            const database = await GChart.find({}).sort({ track_count: -1 }).limit(10);

            const desc = database.map((d, i) => `**${i + 1}. [${d.track_title}](${d.track_url})** | **Played:** \`${d.track_count}\``).join('\n');

            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Top 10 Charts (Global)', iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(client.color)
                .setDescription(desc || 'No data found');

            return interaction.editReply({ embeds: [embed] });

        } else if (choice === 'guild') {
            const database = await Chart.findOne({ guildId: interaction.guild.id });
            // object
            if (!database) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: 'Top 10 Charts (Guild)', iconURL: interaction.guild.iconURL() })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription('No data found')
                return interaction.editReply({ embeds: [embed] });
            }
            // sort
            const sorted = database.track_data.sort((a, b) => b.track_count - a.track_count);
            // 10 
            const top10 = sorted.slice(0, 10);
            // desc
            const desc = top10.map((d, i) => `**${i + 1}. [${d.track_title}](${d.track_url})** | **Played:** \`${d.track_count}\``).join('\n');

            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Top 10 Charts (Guild)', iconURL: interaction.guild.iconURL() })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setColor(client.color)
                .setDescription(desc || 'No data found');

            return interaction.editReply({ embeds: [embed] });

        }
    },
}