const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const moment = require('moment');
const voucher_codes = require('voucher-code-generator');
const Redeem = require("../../settings/models/Redeem.js");

module.exports = {
    name: ["premium", "generate"],
    description: "Generate a premium code!",
    category: "Premium",
    options: [
        {
            name: "plan",
            description: "The plan you want to generate a voucher code for",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "amount",
            description: "The amount of codes you want to generate",
            required: false,
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
        isOwner: true,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const name = interaction.options.getString("plan");
        const camount = interaction.options.getString("amount");

        let codes = [];

        const plan = name;
        const plans = ['daily', 'weekly', 'monthly', 'yearly', 'lifetime'];

        if (!plans.includes(name))
        return interaction.editReply({ content:  `${client.i18n.get(language, "premium", "plan_invalid", {
            plans: plans.join(', ')
        })}` })

        let time;
        if (plan === 'daily') time = Date.now() + 86400000;
        if (plan === 'weekly') time = Date.now() + 86400000 * 7;
        if (plan === 'monthly') time = Date.now() + 86400000 * 30;
        if (plan === 'yearly') time = Date.now() + 86400000 * 365;
        if (plan === 'lifetime') time = Date.now() + 86400000 * 365 * 100;

        let amount = camount;
        if (!amount) amount = 1;

        for (var i = 0; i < amount; i++) {
        const codePremium = voucher_codes.generate({
            pattern: '####-####-####'
        })

        const code = codePremium.toString().toUpperCase()
        const find = await Redeem.findOne({ code: code })

        if (!find) {
            Redeem.create({
                code: code,
                plan: plan,
                expiresAt: time
            }),
                codes.push(`${i + 1} - ${code}`)
            }
        }

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${client.i18n.get(language, "premium", "gen_author")}`, iconURL: client.user.avatarURL() }) //${lang.description.replace("{codes_length}", codes.length).replace("{codes}", codes.join('\n')).replace("{plan}", plan).replace("{expires}", moment(time).format('dddd, MMMM Do YYYY'))}
            .setDescription(`${client.i18n.get(language, "premium", "gen_desc", {
                codes_length: codes.length,
                codes: codes.join('\n'),
                plan: plan,
                expires: moment(time).format('dddd, MMMM Do YYYY')
            })}`)
            .setTimestamp()
            .setFooter({ text: `${client.i18n.get(language, "premium", "gen_footer", {
                prefix: "/"
            })}`, iconURL: interaction.user.displayAvatarURL() })

        interaction.editReply({ embeds: [embed] })
        
    }
}