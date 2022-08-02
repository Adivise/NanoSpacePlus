const delay = require('delay');
const { EmbedBuilder, CommandInteraction, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: "filter",
    description: "Filter Command!",
    options: [
        {
            name: "3d",
            description: "Turning on 3d filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "bass",
            description: "Turning on bass filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'bassboost',
            description: 'Turning on bassboost filter',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'amount',
                    description: 'The amount of the bassboost',
                    type: ApplicationCommandOptionType.Integer,
                }
            ],
        },
        {
            name: "china",
            description: "Turning on china filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "chipmunk",
            description: "Turning on chipmunk filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "darthvader",
            description: "Turning on darthvader filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "daycore",
            description: "Turning on daycore filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "doubletime",
            description: "Turning on doubletime filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "earrape",
            description: "Destroy your ear!",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'equalizer',
            description: 'Custom Equalizer!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'bands',
                    description: 'Number of bands to use (max 14 bands.)',
                    type: ApplicationCommandOptionType.String,
                }
            ],
        },
        {
            name: "nightcore",
            description: "Turning on nightcore filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'pitch',
            description: 'Sets the pitch of the song.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'amount',
                    description: 'The amount of pitch to change the song by.',
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ],
        },
        {
            name: "pop",
            description: "Turning on pop filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "rate",
            description: "Sets the rate of the song.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "amount",
                    description: "The amount of rate to set.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                }
            ],
        },
        {
            name: "reset",
            description: "Reset filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "slowmotion",
            description: "Turning on slowmotion filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "soft",
            description: "Turning on soft filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "speed",
            description: "Sets the speed of the song.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "amount",
                    description: "The amount of speed to set the song to.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                }
            ],
        },
        {
            name: "superbass",
            description: "Turning on superbass filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "television",
            description: "Turning on television filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "treblebass",
            description: "Turning on treblebass filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "tremolo",
            description: "Turning on tremolo filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "vaporwave",
            description: "Turning on vaporwave filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "vibrate",
            description: "Turning on vibrate filter",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "vibrato",
            description: "Turning on vibrato filter",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        //// 3d COMMAND
        if (interaction.options.getSubcommand() === "3d") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "3d"
            })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    rotation: { rotationHz: 0.2 }
                }
    
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "3d"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// BASS COMMAND
        if (interaction.options.getSubcommand() === "bass") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "bass"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: 0.10 },
                        { band: 1, gain: 0.10 },
                        { band: 2, gain: 0.05 },
                        { band: 3, gain: 0.05 },
                        { band: 4, gain: -0.05 },
                        { band: 5, gain: -0.05 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: -0.05 },
                        { band: 8, gain: -0.05 },
                        { band: 9, gain: 0 },
                        { band: 10, gain: 0.05 },
                        { band: 11, gain: 0.05 },
                        { band: 12, gain: 0.10 },
                        { band: 13, gain: 0.10 },
                    ],
                }
                
                await player.node.send(data);
    
            const bassed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "bass"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [bassed] });
        }
        //// BASSBOOST COMMAND
        if (interaction.options.getSubcommand() === "bassboost") {
            try {
                if (user && user.isPremium) {
                const value = interaction.options.getInteger('amount');
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            if(!value) {
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: 0.10 },
                        { band: 1, gain: 0.10 },
                        { band: 2, gain: 0.05 },
                        { band: 3, gain: 0.05 },
                        { band: 4, gain: -0.05 },
                        { band: 5, gain: -0.05 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: -0.05 },
                        { band: 8, gain: -0.05 },
                        { band: 9, gain: 0 },
                        { band: 10, gain: 0.05 },
                        { band: 11, gain: 0.05 },
                        { band: 12, gain: 0.10 },
                        { band: 13, gain: 0.10 },
                    ]
                }
    
                await player.node.send(data);
    
            const msg1 = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                    name: client.commands.get('bassboost').config.name
                })}`);
            const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: client.commands.get('bassboost').config.name
                })}`)
                    .setColor(client.color);
                    
        await delay(2000);
                return msg1.edit({ content: " ", embeds: [embed] });
            } 
    
        if(isNaN(value)) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_number")}`);
            if(value > 10 || value < -10) return interaction.editReply(`${client.i18n.get(language, "filters", "bassboost_limit")}`);
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: value / 10 },
                        { band: 1, gain: value / 10 },
                        { band: 2, gain: value / 10 },
                        { band: 3, gain: value / 10 },
                        { band: 4, gain: value / 10 },
                        { band: 5, gain: value / 10 },
                        { band: 6, gain: value / 10 },
                        { band: 7, gain: 0 },
                        { band: 8, gain: 0 },
                        { band: 9, gain: 0 },
                        { band: 10, gain: 0 },
                        { band: 11, gain: 0 },
                        { band: 12, gain: 0 },
                        { band: 13, gain: 0 },
                    ]
                }
                await player.node.send(data);
        const msg2 = await interaction.editReply(`${client.i18n.get(language, "filters", "bassboost_loading", {
                    amount: value
                    })}`);
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "bassboost_set", {
                    amount: value
                    })}`)
                    .setColor(client.color);
                
        await delay(2000);
                return msg2.edit({ content: " ", embeds: [embed] });
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
        //// CHINA COMMAND
        if (interaction.options.getSubcommand() === "china") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "china"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    timescale: { 
                        speed: 0.75, 
                        pitch: 1.25, 
                        rate: 1.25 
                    }
                }
    
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "china"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// CHIPMUNK COMMAND
        if (interaction.options.getSubcommand() === "chipmunk") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "chipmunk"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    timescale: {
                        speed: 1.05,
                        pitch: 1.35,
                        rate: 1.25
                    },
                }
    
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "chipmunk"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// DARTHVADER COMMAND
        if (interaction.options.getSubcommand() === "darthvader") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "darthvader"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    timescale: {
                        speed: 0.975,
                        pitch: 0.5,
                        rate: 0.8
                    },
                }
        
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "darthvader"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// DAYCORE COMMAND
        if (interaction.options.getSubcommand() === "daycore") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "daycore"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: 0 },
                        { band: 1, gain: 0 },
                        { band: 2, gain: 0 },
                        { band: 3, gain: 0 },
                        { band: 4, gain: 0 },
                        { band: 5, gain: 0 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: 0 },
                        { band: 8, gain: -0.25 },
                        { band: 9, gain: -0.25 },
                        { band: 10, gain: -0.25 },
                        { band: 11, gain: -0.25 },
                        { band: 12, gain: -0.25 },
                        { band: 13, gain: -0.25 },
                    ],
                    timescale: {
                        pitch: 0.63,
                        rate: 1.05
                    },
                }
        
                await player.node.send(data);
    
            const daycored = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "daycore"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [daycored] });
        }
        //// DOUBLETIME COMMAND
        if (interaction.options.getSubcommand() === "doubletime") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "doubletime"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    timescale: {
                        speed: 1.165,
                    },
                }
        
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "doubletime"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// EARRAPE COMMAND
        if (interaction.options.getSubcommand() === "earrape") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "earrape"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
            await player.setVolume(500);
            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
            }
            await player.node.send(data);
    
            const earrapped = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "earrape"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [earrapped] });
        }
        //// EQUALIZER COMMAND
        if (interaction.options.getSubcommand() === "equalizer") {
            try {
                if (user && user.isPremium) {
                const value = interaction.options.getString('bands');

                const player = client.manager.get(interaction.guild.id);
                if(!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            if (!value) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${client.i18n.get(language, "filters", "eq_author")}`, iconURL: `${client.i18n.get(language, "filters", "eq_icon")}` })
                    .setColor(client.color)
                    .setDescription(`${client.i18n.get(language, "filters", "eq_desc")}`)
                    .addFields({ name: `${client.i18n.get(language, "filters", "eq_field_title")}`, value: `${client.i18n.get(language, "filters", "eq_field_value", {
                        prefix: "/"
                    })}`, inline: false })
                    .setFooter({ text: `${client.i18n.get(language, "filters", "eq_footer", {
                        prefix: "/"
                    })}` })
                return interaction.editReply({ embeds: [embed] });
            }
            else if (value == 'off' || value == 'reset') {
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                }
                return player.node.send(data);
            }
    
            const bands = value.split(/[ ]+/);
            let bandsStr = '';
            for (let i = 0; i < bands.length; i++) {
                if (i > 13) break;
                if (isNaN(bands[i])) return interaction.editReply(`${client.i18n.get(language, "filters", "eq_number", {
                    num: i + 1
                })}`);
                if (bands[i] > 10) return interaction.editReply(`${client.i18n.get(language, "filters", "eq_than", {
                    num: i + 1
                })}`);
            }
    
            for (let i = 0; i < bands.length; i++) {
                if (i > 13) break;
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: i, gain: (bands[i]) / 10 },
                    ]
                }
                player.node.send(data);
                bandsStr += `${bands[i]} `;
            }
        
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "eq_loading", {
                bands: bandsStr
                })}`);
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "eq_on", {
                    bands: bandsStr
                    })}`)
                .setColor(client.color);
    
            await delay(2000);
            return msg.edit({ content: " ", embeds: [embed] });
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
        //// NIGHTCORE COMMAND
        if (interaction.options.getSubcommand() === "nightcore") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "nightcore"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    timescale: {
                        speed: 1.165,
                        pitch: 1.125,
                        rate: 1.05
                    },
                }
        
                await player.node.send(data);
    
            const nightcored = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "nightcore"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [nightcored] });
        }
        //// PITCH COMMAND
        if (interaction.options.getSubcommand() === "pitch") {
            const value = interaction.options.getInteger('amount');

            const player = client.manager.get(interaction.guild.id);
            if(!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
        //	if (isNaN(value)) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_number")}`);
            if (value < 0) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_greater")}`);
            if (value > 10) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_less")}`);
    
            const data = {
                op: 'filters',
                guildId: message.guild.id,
                timescale: { pitch: value },
            }
    
            await player.node.send(data);
    
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "pitch_loading", {
                amount: value
            })}`);
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "pitch_on", {
                    amount: value
                })}`)
                .setColor(client.color);
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// POP COMMAND
        if (interaction.options.getSubcommand() === "pop") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "pop"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: 0.65 },
                        { band: 1, gain: 0.45 },
                        { band: 2, gain: -0.45 },
                        { band: 3, gain: -0.65 },
                        { band: 4, gain: -0.35 },
                        { band: 5, gain: 0.45 },
                        { band: 6, gain: 0.55 },
                        { band: 7, gain: 0.6 },
                        { band: 8, gain: 0.6 },
                        { band: 9, gain: 0.6 },
                        { band: 10, gain: 0 },
                        { band: 11, gain: 0 },
                        { band: 12, gain: 0 },
                        { band: 13, gain: 0 },
                    ]
                }
        
                await player.node.send(data);
    
            const popped = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "pop"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [popped] });
        }
        //// RATE COMMAND
        if (interaction.options.getSubcommand() === "rate") {
            const value = interaction.options.getInteger('amount');

            const player = client.manager.get(interaction.guild.id);
            if(!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
        //	if (isNaN(value)) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_number")}`);
            if (value < 0) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_greater")}`);
            if (value > 10) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_less")}`);
    
            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
                timescale: { rate: value },
            }
    
            await player.node.send(data);
            
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "rate_loading", {
                amount: value
                })}`);
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "rate_on", {
                    amount: value
                })}`)
                .setColor(client.color);
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// RESET COMMAND
        if (interaction.options.getSubcommand() === "reset") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "reset_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
            }
    
            await player.node.send(data);
            await player.setVolume(100);
            
            const resetted = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "reset_on")}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [resetted] });
        }
        //// SLOWMOTION COMMAND
        if (interaction.options.getSubcommand() === "slowmotion") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "slowmotion"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    timescale: {
                        speed: 0.5,
                        pitch: 1.0,
                        rate: 0.8
                    }
                }
    
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "slowmotion"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// SOFT COMMAND
        if (interaction.options.getSubcommand() === "soft") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "soft"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
            
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: 0 },
                        { band: 1, gain: 0 },
                        { band: 2, gain: 0 },
                        { band: 3, gain: 0 },
                        { band: 4, gain: 0 },
                        { band: 5, gain: 0 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: 0 },
                        { band: 8, gain: -0.25 },
                        { band: 9, gain: -0.25 },
                        { band: 10, gain: -0.25 },
                        { band: 11, gain: -0.25 },
                        { band: 12, gain: -0.25 },
                        { band: 13, gain: -0.25 },
                    ]
                }
    
                await player.node.send(data);
    
            const softed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "soft"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [softed] });
        }
        //// SPEED COMMAND
        if (interaction.options.getSubcommand() === "speed") {
            const value = interaction.options.getInteger('amount');

            const player = client.manager.get(interaction.guild.id);
            if(!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
        //	if (isNaN(args[0])) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_number")}`);
            if (value < 0) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_greater")}`);
            if (value > 10) return interaction.editReply(`${client.i18n.get(language, "filters", "filter_less")}`);
    
            const data = {
                op: 'filters',
                guildId: interaction.guild.id,
                timescale: { speed: value },
            }
    
            await player.node.send(data);
    
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "speed_loading", {
                amount: value
                })}`);
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "speed_on", {
                    amount: value
                })}`)
                .setColor(client.color);
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// SUPERBASS COMMAND
        if (interaction.options.getSubcommand() === "superbass") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "superbass"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: 0.2 },
                        { band: 1, gain: 0.3 },
                        { band: 2, gain: 0 },
                        { band: 3, gain: 0.8 },
                        { band: 4, gain: 0 },
                        { band: 5, gain: 0.5 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: -0.5 },
                        { band: 8, gain: 0 },
                        { band: 9, gain: 0 },
                        { band: 10, gain: 0 },
                        { band: 11, gain: 0 },
                        { band: 12, gain: 0 },
                        { band: 13, gain: 0 },
                    ]
                }
    
                await player.node.send(data);
    
            const sbed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "superbass"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [sbed] });
        }
        //// TELEVISION COMMAND
        if (interaction.options.getSubcommand() === "television") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "television"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
            
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: 0 },
                        { band: 1, gain: 0 },
                        { band: 2, gain: 0 },
                        { band: 3, gain: 0 },
                        { band: 4, gain: 0 },
                        { band: 5, gain: 0 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: 0.65 },
                        { band: 8, gain: 0.65 },
                        { band: 9, gain: 0.65 },
                        { band: 10, gain: 0.65 },
                        { band: 11, gain: 0.65 },
                        { band: 12, gain: 0.65 },
                        { band: 13, gain: 0.65 },
                    ]
                }
    
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "television"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// TREBLEBASS COMMAND
        if (interaction.options.getSubcommand() === "treblebass") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "treblebass"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: 0.6 },
                        { band: 1, gain: 0.67 },
                        { band: 2, gain: 0.67 },
                        { band: 3, gain: 0 },
                        { band: 4, gain: -0.5 },
                        { band: 5, gain: 0.15 },
                        { band: 6, gain: -0.45 },
                        { band: 7, gain: 0.23 },
                        { band: 8, gain: 0.35 },
                        { band: 9, gain: 0.45 },
                        { band: 10, gain: 0.55 },
                        { band: 11, gain: 0.6 },
                        { band: 12, gain: 0.55 },
                        { band: 13, gain: 0 },
                    ]
                }
    
                await player.node.send(data);
    
            const tbed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "treblebass"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [tbed] });
        }
        //// TREMOLO COMMAND
        if (interaction.options.getSubcommand() === "tremolo") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "tremolo"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    tremolo: {
                        frequency: 4.0,
                        depth: 0.75
                    },
                }
    
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "trembolo"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// VAPORWAVE COMMAND
        if (interaction.options.getSubcommand() === "vaporwave") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "vaporwave"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    equalizer: [
                        { band: 0, gain: 0 },
                        { band: 1, gain: 0 },
                        { band: 2, gain: 0 },
                        { band: 3, gain: 0 },
                        { band: 4, gain: 0 },
                        { band: 5, gain: 0 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: 0 },
                        { band: 8, gain: 0.15 },
                        { band: 9, gain: 0.15 },
                        { band: 10, gain: 0.15 },
                        { band: 11, gain: 0.15 },
                        { band: 12, gain: 0.15 },
                        { band: 13, gain: 0.15 },
                    ],
                    timescale: {
                        pitch: 0.55,
                    },
                }
    
                await player.node.send(data);
    
            const vaporwaved = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "vaporwave"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [vaporwaved] });
        }
        //// VIBRATE COMMAND
        if (interaction.options.getSubcommand() === "vibrate") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "vibrate"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    vibrato: {
                        frequency: 4.0,
                        depth: 0.75
                    },
                    tremolo: {
                        frequency: 4.0,
                        depth: 0.75
                    },
                }
    
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "vibrate"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
        //// VIBRATO COMMAND
        if (interaction.options.getSubcommand() === "vibrato") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
                name: "vibrato"
                })}`);
    
                const player = client.manager.get(interaction.guild.id);
                if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
                const data = {
                    op: 'filters',
                    guildId: interaction.guild.id,
                    vibrato: {
                        frequency: 4.0,
                        depth: 0.75
                    },
                }
    
                await player.node.send(data);
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                    name: "vibrato"
                })}`)
                .setColor(client.color);
    
            await delay(2000);
            msg.edit({ content: " ", embeds: [embed] });
        }
    }
};