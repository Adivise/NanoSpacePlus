const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const Premium = require("../../settings/models/Premium.js");
const Profile = require("../../settings/models/Profile.js");

module.exports = {
    name: ["profile"],
    description: "View your premium profile!",
    category: "Premium",
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
        await interaction.deferReply({ ephemeral: false });
        
        const info = await Premium.findOne({ Id: interaction.user.id });
        const timeLeft = moment.duration(info.premium.expiresAt - Date.now()).format("d [days], h [hours], m [minutes]");
        const profile = await Profile.findOne({ userId: interaction.user.id });
        const listenTime = moment.duration(profile.listenTime).format("d [days], h [hours], m [minutes]");

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor(client.color)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFields([
                { name: "Songs Played:", value: `${profile.playedCount}`, inline: true },
                { name: "Commands Used:", value: `${profile.useCount}`, inline: true },
            ])
            .setTimestamp()
            .setFooter({ text: "Caculate with all (Globally)" })

            if (profile.listenTime === 0) {
                embed.addFields({ name: "Listening Time:", value: "No Listin", inline: true });
            } else {
                embed.addFields({ name: "Listening Time:", value: `${listenTime}`, inline: true })
            }

            if (info.premium.plan === "lifetime") {
                embed.addFields([
                    { name: `Plan:`, value: `${toOppositeCase(info.premium.plan)}`, inline: true },
                    { name: `Expires:`, value: `Never`, inline: true },
                ])
            } else {
                embed.addFields([
                    { name: `Plan:`, value: `${toOppositeCase(info.premium.plan || "Free")}`, inline: true }
                ])
                if (info.premium.expiresAt < Date.now()) {
                    embed.addFields([
                        { name: `Expires:`, value: `Never`, inline: true },
                        { name: "Unlock", value: "Not Fully", inline: true },
                    ])
                } else {
                    embed.addFields([
                        { name: `Expires:`, value: `${timeLeft}`, inline: true },
                        { name: "Unlock", value: "Fully", inline: true },
                    ])
                }
            }

        return interaction.editReply({ embeds: [embed] });
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}