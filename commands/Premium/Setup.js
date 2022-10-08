const { EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const Setup = require("../../settings/models/Setup.js");

module.exports = {
    name: ["premium", "setup"],
    description: "Setup channel song request",
    category: "Premium",
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`${client.i18n.get(language, "utilities", "lang_perm")}`);

        const player = client.manager.get(interaction.guild.id);
        if (player) player.destroy();

        try {
            if (user && user.isPremium) {
                await interaction.guild.channels.create({
                    name: "song-request",
                    type: 0, // 0 = text, 2 = voice
                    topic: `${client.i18n.get(language, "setup", "setup_topic")}`,
                    parent_id: interaction.channel.parentId,
                    user_limit: 3,
                    rate_limit_per_user: 3, 
                }).then(async (channel) => {

                const attachment = new AttachmentBuilder("./settings/images/banner.png", { name: "setup.png" });

                const queueMsg = `${client.i18n.get(language, "setup", "setup_queuemsg")}`;

                const playEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: `${client.i18n.get(language, "setup", "setup_playembed_author")}` })
                    .setImage(`${client.i18n.get(language, "setup", "setup_playembed_image")}`)
                    .setDescription(`${client.i18n.get(language, "setup", "setup_playembed_desc")}`)
                    .setFooter({ text: `${client.i18n.get(language, "setup", "setup_playembed_footer", {
                        prefix: "/"
                    })}` });

                await channel.send({ files: [attachment] });
                    await channel.send({ content: `${queueMsg}`, embeds: [playEmbed], components: [client.diSwitch] }).then(async (playmsg) => {
                        await Setup.findOneAndUpdate({ guild: interaction.guild.id }, {
                            guild: interaction.guild.id,
                            enable: true,
                            channel: channel.id,
                            playmsg: playmsg.id,
                        });
                        
                        const embed = new EmbedBuilder()
                            .setDescription(`${client.i18n.get(language, "setup", "setup_msg", {
                                channel: channel,
                            })}`)
                            .setColor(client.color);

                        return interaction.followUp({ embeds: [embed] });
                    })
                });
            } else {
                    const Premiumed = new EmbedBuilder()
                        .setAuthor({ name: `${client.i18n.get(language, "nopremium", "premium_author")}`, iconURL: client.user.displayAvatarURL() })
                        .setDescription(`${client.i18n.get(language, "nopremium", "premium_desc")}`)
                        .setColor(client.color)
                        .setTimestamp()
            
                    return interaction.editReply({ content: " ", embeds: [Premiumed] });
                }
        } catch (err) {
            console.log(err)
            interaction.editReply({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
        }
    }
}