const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "247"],
    description: "24/7 in voice channel",
    category: "Music",
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "247_loading")}`);

        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        try {
            if (user && user.isPremium) {
                if (player.twentyFourSeven) {
                    player.twentyFourSeven = false;

                    const off = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "music", "247_off")}`)
                        .setColor(client.color);

                msg.edit({ content: " ", embeds: [off] });
                } else {
                    player.twentyFourSeven = true;

                    const on = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "music", "247_on")}`)
                        .setColor(client.color);

                    msg.edit({ content: " ", embeds: [on] });
                }
            } else {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "nopremium", "premium_author")}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`${client.i18n.get(language, "nopremium", "premium_desc")}`)
                .setColor(client.color)
                .setTimestamp()

            return msg.edit({ content: " ", embeds: [embed] });
            }
        } catch (err) {
            console.log(err);
            msg.edit({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
        }
    }
}