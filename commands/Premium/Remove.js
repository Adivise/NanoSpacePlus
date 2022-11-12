const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Premium = require("../../settings/models/Premium.js");

module.exports = {
    name: ["premium", "remove"],
    description: "Remove premium from members!",
    category: "Premium",
    options: [
        {
            name: "target",
            description: "Mention a user want to remove!",
            required: true,
            type: ApplicationCommandOptionType.User,
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
        isOwner: true,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const mentions = interaction.options.getUser("target");
        
        const db = await Premium.findOne({ Id: mentions.id });

        if (db.isPremium) {
            db.isPremium = false
            db.premium.redeemedBy = []
            db.premium.redeemedAt = null
            db.premium.expiresAt = null
            db.premium.plan = null

            const newUser = await db.save({ new: true }).catch(() => {})
            client.premiums.set(newUser.Id, newUser);

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "premium", "remove_desc", {
                    user: mentions
                })}`)
                .setColor(client.color)

            interaction.editReply({ embeds: [embed] });

        } else {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "premium", "remove_already", {
                    user: mentions
                })}`)
                .setColor(client.color)

            interaction.editReply({ embeds: [embed] });
        }
    }
}