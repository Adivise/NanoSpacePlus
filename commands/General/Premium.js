const { MessageEmbed, MessageAttachment } = require('discord.js');
const moment = require('moment');
const voucher_codes = require('voucher-code-generator');
const Redeem = require("../../settings/models/Redeem.js");
const Setup = require("../../settings/models/Setup.js");
const Premium = require("../../settings/models/Premium.js");

module.exports = { 
    name: "premium",
    description: "Premium Command!",
    options: [
        {
            name: "generate",
            description: "Generate a premium code (Owner only)",
            type: 1, //// SUBCOMMAND = 1
            options: [
                {
                    name: "plan",
                    description: "The plan you want to generate a voucher code for",
                    required: true,
                    type: 3
                },
                {
                    name: "amount",
                    description: "The amount of codes you want to generate",
                    required: false,
                    type: 3
                }
            ],
        },
        {
            name: "profile",
            description: "View your premium profile!",
            type: 1
        },
        {
            name: "redeem",
            description: "Redeem your premium!",
            type: 1,
            options: [
                {
                    name: "code",
                    description: "The code you want to redeem",
                    required: true,
                    type: 3
                }
            ],
        },
        {
            name: "setup",
            description: "Setup channel song request",
            type: 1,
            options: [
                {
                    name: "type",
                    description: "Type of channel",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Create",
                            value: "create"
                        },
                        {
                            name: "Delete",
                            value: "delete"
                        }
                    ]
                },
            ]
        }
    ],
run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        ///// GENERATE PREMIUM CODE COMMAND!
        if (interaction.options.getSubcommand() === "generate") {
            if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });

                const name = interaction.options.getString("plan");
                const camount = interaction.options.getString("amount");
        
            let codes = [];
        
            const plan = name;
            const plans = ['daily', 'weekly', 'monthly', 'yearly'];
        
            if (!plans.includes(name))
            return interaction.editReply({ content:  `${client.i18n.get(language, "premium", "plan_invalid", {
                plans: plans.join(', ')
            })}` })
        
            let time;
            if (plan === 'daily') time = Date.now() + 86400000;
            if (plan === 'weekly') time = Date.now() + 86400000 * 7;
            if (plan === 'monthly') time = Date.now() + 86400000 * 30;
            if (plan === 'yearly') time = Date.now() + 86400000 * 365;
        
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
        
            const embed = new MessageEmbed()
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
        ///// PROFILE COMMAND!
        if (interaction.options.getSubcommand() === "profile") {
            const PremiumPlan = await Premium.findOne({ Id: interaction.user.id })
            const expires = moment(PremiumPlan.premium.expiresAt).format('dddd, MMMM Do YYYY HH:mm:ss');
    
            try {
            if (user && user.isPremium) {
                const embed = new MessageEmbed()
                    .setAuthor({ name: `${client.i18n.get(language, "premium", "profile_author")}`, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`${client.i18n.get(language, "premium", "profile_desc", {
                        user: interaction.user.tag,
                        plan: PremiumPlan.premium.plan,
                        expires: expires
                    })}`)
                    .setColor(client.color)
                    .setTimestamp()
    
                return interaction.editReply({ embeds: [embed] });
    
            } else {
                const Premiumed = new MessageEmbed()
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
        ///// REDEEM PREMIUM CODE COMMAND!
        if (interaction.options.getSubcommand() === "redeem") {
            const input = interaction.options.getString("code");
        
            let member = await Premium.findOne({ Id: interaction.user.id })
      
            let code = input;
            if (!code)
                return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`${client.i18n.get(language, "premium", "redeem_arg")}`),
                ],
            })
    
            if (member && member.isPremium) {
                return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`${client.i18n.get(language, "premium", "redeem_already")}`),
                ],
            })
        }
      
            const premium = await Redeem.findOne({
                code: code.toUpperCase(),
            })
      
            if (premium) {
                const expires = moment(premium.expiresAt).format(
                'dddd, MMMM Do YYYY HH:mm:ss',
            )
      
            member.isPremium = true
            member.premium.redeemedBy.push(interaction.user)
            member.premium.redeemedAt = Date.now()
            member.premium.expiresAt = premium.expiresAt
            member.premium.plan = premium.plan
    
            member = await member.save({ new: true }).catch(() => {})
            client.premiums.set(interaction.user.id, member)
            await premium.deleteOne().catch(() => {})
    
            interaction.editReply({
                embeds: [
                new MessageEmbed()
                    .setTitle(`${client.i18n.get(language, "premium", "redeem_title")}`)
                    .setDescription(`${client.i18n.get(language, "premium", "redeem_desc", {
                        expires: expires,
                    })}`)
                    .setColor(client.color)
                    .setTimestamp(),
                ],
            })
      
            } else {
            return interaction.editReply({
                embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`${client.i18n.get(language, "premium", "redeem_invalid")}`),
                    ],
                })
            }
        }
        ///// SETUP CHANNEL SONG REQUEST COMMAND!
        if (interaction.options.getSubcommand() === "setup") {
            if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.editReply(`${client.i18n.get(language, "utilities", "lang_perm")}`);
            try {
                if (user && user.isPremium) {
                    if(interaction.options._hoistedOptions.find(c => c.value === "create")) {
                        await interaction.guild.channels.create(`song-request`, {
                            type: 'GUILD_TEXT',
                            topic: `${client.i18n.get(language, "setup", "setup_topic")}`,
                            parent: interaction.channel.parentId,
                            userLimit: 3,
                            rateLimitPerUser: 3,
                        }).then(async (channel) => {

                        const attachment = new MessageAttachment("./settings/images/banner.png", "setup.png");

                        const queueMsg = `${client.i18n.get(language, "setup", "setup_queuemsg")}`;

                        const playEmbed = new MessageEmbed()
                            .setColor(client.color)
                            .setAuthor({ name: `${client.i18n.get(language, "setup", "setup_playembed_author")}` })
                            .setImage(`${client.i18n.get(language, "setup", "setup_playembed_image")}`)
                            .setDescription(`${client.i18n.get(language, "setup", "setup_playembed_desc")}`)
                            .setFooter({ text: `${client.i18n.get(language, "setup", "setup_playembed_footer")}` });

                        await channel.send({ files: [attachment] });
                            await channel.send({ content: `${queueMsg}`, embeds: [playEmbed], components: [client.diSwitch] }).then(async (playmsg) => {
                                await Setup.findOneAndUpdate({ guild: interaction.guild.id }, {
                                    guild: interaction.guild.id,
                                    enable: true,
                                    channel: channel.id,
                                    playmsg: playmsg.id,
                                }, { upsert: true, new: true });

                                const embed = new MessageEmbed()
                                    .setDescription(`${client.i18n.get(language, "setup", "setup_msg", {
                                        channel: channel,
                                    })}`)
                                    .setColor(client.color);

                                return interaction.followUp({ embeds: [embed] });
                            })
                        });
                    }
                    if(interaction.options._hoistedOptions.find(c => c.value === "delete")) {
                        await Setup.findOneAndUpdate({ guild: interaction.guild.id }, {
                                guild: interaction.guild.id,
                                enable: false,
                                channel: "",
                                playmsg: "",
                            });
                            
                            const embed = new MessageEmbed()
                                .setDescription(`${client.i18n.get(language, "setup", "setup_deleted")}`)
                                .setColor(client.color);

                            return interaction.editReply({ embeds: [embed] });
                    }
                } else {
                        const Premiumed = new MessageEmbed()
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
};