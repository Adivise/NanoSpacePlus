const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Setup = require("../../settings/models/Setup.js");

module.exports = {
    name: ["premium", "setup"],
    description: "Setup channel song request",
    category: "Premium",
    permissions: {
        channel: [],
        bot: ["ManageChannels", "ManageMessages", "AttachFiles"],
        user: ["ManageGuild"]
    },
    settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language, player) => {
        await interaction.deferReply({ ephemeral: false });

        if (player) player.destroy();

        await interaction.guild.channels.create({
            name: "song-request",
            type: 0, // 0 = text, 2 = voice
            topic: `${client.i18n.get(language, "setup", "setup_topic")}`,
            parent: interaction.channel.parentId,
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
    }
}