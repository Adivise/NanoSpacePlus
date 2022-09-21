const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["music", "autoplay"],
    description: "Autoplay music (Random play songs)",
    category: "Music",
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "autoplay_loading")}`);

        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);

        const autoplay = player.get("autoplay");

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        try {
            if (user && user.isPremium) {
                if (autoplay === true) {
        
                    await player.set("autoplay", false);
                    await player.queue.clear();
        
                    const off = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "music", "autoplay_off")}`)
                        .setColor(client.color);
        
                    msg.edit({ content: " ", embeds: [off] });
                } else {
        
                    const identifier = player.queue.current.identifier;
                    const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
                    const res = await player.search(search, interaction.user);
        
                    await player.set("autoplay", true);
                    await player.set("requester", interaction.user);
                    await player.set("identifier", identifier);
                    await player.queue.add(res.tracks[1]);
        
                    const on = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "autoplay_on")}`)
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
            console.log(err)
            msg.edit({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
        }
    }
}