const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: ["utility", "vps"], // The name of the command
    description: "Display the VPS stats", // The description of the command (for help text)
    category: "Utility",
    permissions: {
        channel: [],
        bot: [],
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
        // owner only
        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });

        const totalSeconds = os.uptime();
        const realTotalSecs = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % (31536 * 100)) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const mins = Math.floor((totalSeconds / 60) % 60);

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'VPS', iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setColor(client.color)
            .addFields(
                { name: 'Host', value: `${os.type()} ${os.release()} (${os.arch()})` },
                { name: 'CPU', value: `${os.cpus()[0].model}` },
                { name: 'Uptime', value: `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds` },
                { name: 'RAM', value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` },
                { name: 'Memory Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
                { name: 'CPU Load', value: `${(os.loadavg()[0]).toFixed(2)}%` },
                { name: 'CPU Cores', value: `${os.cpus().length}` },
            )
            .setFooter({ text: `Node.js ${process.version}` })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    }
}