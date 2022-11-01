const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const KoFi = require("../../settings/models/Donate.js");
const Codes = require('voucher-code-generator');
const Redeem = require("../../settings/models/Redeem.js");

module.exports = {
    name: ["premium", "transaction"],
    description: "Verify ko-fi transaction",
    category: "Premium",
    options: [
        {
            name: "id",
            description: "The transaction id",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const input = interaction.options.getString("id");
        const kofi = await KoFi.findOne({ transaction: input });

        let codes = [];

        if (kofi) {
            if (kofi.useable === true) return interaction.editReply({ content: "This transaction has already been used." });

            const generate = Codes.generate({
                pattern: '####-####-####'
            });

            const code = generate.toString().toUpperCase();
            const find = await Redeem.findOne({ code: code });

            if (!find) {
                if (kofi.type === "Donation") {
                    Redeem.create({
                        code: code,
                        plan: "weekly",
                        expiresAt: Date.now() + 86400000 * 7,
                    });
                } else if (kofi.type === "Subscription") {
                    Redeem.create({
                        code: code,
                        plan: "monthly",
                        expiresAt: Date.now() + 86400000 * 30,
                    });
                } else if (kofi.type === "Commission") {
                    // I not have commission plan
                    return interaction.editReply({ content: "I not support Commission Transaction" });
                } else if (kofi.type === "Shop Order") {
                    // I not have shop plan
                    return interaction.editReply({ content: "I not support Shop Order Transaction" });
                }

                codes.push(`${code}`);
            }

            KoFi.findOneAndUpdate({ transaction: input }, { $set: { useable: true } }, { new: true }, (err, doc) => {
                if (err) console.log(err);
            });

            const embed = new EmbedBuilder()
                .setTitle("Verify Transaction")
                .setDescription(`Here your code is: \`${codes.join('\n')}\``)
                .setColor(client.color)
                .setFooter({ text: `${client.i18n.get(language, "premium", "gen_footer", {
                    prefix: "/"
                })}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`This transaction id is invalid.`)

            return interaction.editReply({ embeds: [embed] })
        }
    }
}