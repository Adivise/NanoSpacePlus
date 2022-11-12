const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const moment = require('moment');
const Premium = require("../../settings/models/Premium.js");
const Redeem = require("../../settings/models/Redeem.js");

module.exports = {
    name: ["redeem"],
    description: "Redeem your premium!",
    category: "Premium",
    options: [
        {
            name: "code",
            description: "The code you want to redeem",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
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
        
        const input = interaction.options.getString("code");
        
        let member = await Premium.findOne({ Id: interaction.user.id })

        if (member && member.isPremium) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_already")}`)
            return interaction.editReply({ embeds: [embed] });
        }
  
        const premium = await Redeem.findOne({ code: input.toUpperCase() });
        if (premium) {
            const expires = moment(premium.expiresAt).format('do/MMMM/YYYY (HH:mm:ss)')
  
            member.isPremium = true
            member.premium.redeemedBy.push(interaction.user)
            member.premium.redeemedAt = Date.now()
            member.premium.expiresAt = premium.expiresAt
            member.premium.plan = premium.plan

            member = await member.save({ new: true });
            client.premiums.set(interaction.user.id, member);
            await premium.deleteOne();

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "premium", "redeem_title")}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`${client.i18n.get(language, "premium", "redeem_desc", {
                    expires: expires,
                    plan: premium.plan
                })}`)
                .setColor(client.color)
                .setTimestamp()

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_invalid")}`)
            return interaction.editReply({ embeds: [embed] })
        }
    }
}