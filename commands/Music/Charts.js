const { EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const Chart = require("../../settings/models/GuildChart.js");
const GChart = require("../../settings/models/GlobalChart.js");
const Canvas = require("@napi-rs/canvas");

module.exports = {
    name: ["chart"], // The name of the command
    description: "Display Top 5 songs of the (global/guild)", // The description of the command (for help text)
    category: "Music",
    options: [
        {
            name: 'mode',
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
    permissions: {
        channel: [],
        bot: ["AttachFiles"],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false});

        const choice = interaction.options.getString('mode');

        const canvas = Canvas.createCanvas(1000, 625);
		const ctx = canvas.getContext('2d');

        const placer = await Canvas.loadImage("./settings/images/chart.png");
        ctx.drawImage(placer, 5, 5, canvas.width, canvas.height);

        if (choice === 'global') {
            const database = await GChart.find({}).sort({ track_count: -1 }).limit(5);

            // draw black blur background
            ctx.fillStyle = '#000001';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(20, 250, 955, 350);
            ctx.globalAlpha = 1;

            ctx.font = 'bold 25px Verdana';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('TOP 5 CHARTS | GLOBAL', 250, 140);

            ctx.font = '25px Verdana';
            ctx.fillStyle = '#ffffff';
  
            database.map((d, i) => {
                // title don't exceeds canvas height
                try {
                    if (ctx.measureText(d.track_title).width > 700) {
                        const title = d.track_title.substring(0, 50);
                        ctx.fillText(`${i + 1} | Played: ${d.track_count} • ${title}...`, 50, 320 + (i * 60));
                    } else {
                        ctx.fillText(`${i + 1} | Played: ${d.track_count} • ${d.track_title}`, 50, 320 + (i * 60));
                    }
                } catch (e) {
                    ctx.fillText('No data found', 30, 320 + (i * 60));
                }
            });

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            // stoke style bold
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#FB97F1';
            ctx.stroke();
            ctx.closePath();
            ctx.clip();

            const avatar = await Canvas.loadImage(client.user.displayAvatarURL({ format: 'png' }));
            ctx.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'chart.png' });

            return interaction.editReply({ files: [attachment] });

        } else if (choice === 'guild') {
            const database = await Chart.findOne({ guildId: interaction.guild.id });
            // object
            if (!database) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: 'Top 5 Charts | Guild', iconURL: interaction.guild.iconURL() })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setColor(client.color)
                    .setDescription('No data found')
                return interaction.editReply({ embeds: [embed] });
            }
            // sort
            const sorted = database.playedHistory.sort((a, b) => b.track_count - a.track_count);
            // 10 
            const top10 = sorted.slice(0, 5);

            // draw black blur background
            ctx.fillStyle = '#000001';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(20, 250, 955, 350);
            ctx.globalAlpha = 1;

            ctx.font = 'bold 25px Verdana';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`TOP 5 CHARTS | ${interaction.guild.name}`, 250, 140);

            ctx.font = '25px Verdana';
            ctx.fillStyle = '#ffffff';
            // desc
            top10.map((d, i) => {
                // font exceeds canvas height
                if (ctx.measureText(d.track_title).width > 700) {
                    const title = d.track_title.substring(0, 50);
                    ctx.fillText(`${i + 1} | Played: ${d.track_count} • ${title}...`, 50, 320 + (i * 60));
                } else {
                    ctx.fillText(`${i + 1} | Played: ${d.track_count} • ${d.track_title}`, 50, 320 + (i * 60));
                }
            });

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            // stoke style bold
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#FB97F1';
            ctx.stroke();
            ctx.closePath();
            ctx.clip();

            const avatar = await Canvas.loadImage(interaction.guild.iconURL({ format: 'png' }));
            ctx.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'chart.png' });

            return interaction.editReply({ files: [attachment] });

        }
    },
}