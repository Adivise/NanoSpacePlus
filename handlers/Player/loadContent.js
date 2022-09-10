const { EmbedBuilder, Client, Message } = require("discord.js");
const Setup = require("../../settings/models/Setup.js");
const GLang = require("../../settings/models/Language.js");
const delay = require("delay");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
try {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.guild || interaction.user.bot) return;
        if (interaction.isButton()) {
            const { customId, member } = interaction;
            let voiceMember = interaction.guild.members.cache.get(member.id);
            let channel = voiceMember.voice.channel;

            let player = await client.manager.get(interaction.guild.id);
            if (!player) return;

            const playChannel = client.channels.cache.get(player.textChannel);
            if (!playChannel) return;
        
            let guildModel = await GLang.findOne({ guild: playChannel.guild.id });
            if (!guildModel) { guildModel = await GLang.create({
                    guild: playChannel.guild.id,
                    language: "en",
                });
            }

            const { language } = guildModel;

            switch (customId) {
                case "sprevious":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player || !player.queue.previous) {
                            return interaction.reply(`${client.i18n.get(language, "music", "previous_notfound")}`);
                        } else {
                            await player.queue.unshift(player.queue.previous);
                            await player.stop();

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "music", "previous_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "sskip":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {}
                        if (player.queue.size == 0) {
                            await player.destroy();
                            await client.UpdateMusic(player);

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        } else {
                            await player.stop();

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "sstop":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {
                            await player.destroy();
                            await client.UpdateMusic(player);

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "player", "stop_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "spause":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {
                            await player.pause(!player.paused);
                            const uni = player.paused ? `${client.i18n.get(language, "player", "switch_pause")}` : `${client.i18n.get(language, "player", "switch_resume")}`;

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "player", "pause_msg", {
                                pause: uni,
                                })}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "sloop":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {
                            await player.setQueueRepeat(!player.queueRepeat);
                            const uni = player.queueRepeat ? `${client.i18n.get(language, "player", "switch_enable")}` : `${client.i18n.get(language, "player", "switch_disable")}`;
                    
                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "player", "repeat_msg", {
                                loop: uni,
                                })}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                break;
            default:
                break;
            }
        }
    });
    } catch (e) {
        console.log(e);
}
/**
 * @param {Client} client
 * @param {Message} message
 */

client.on("messageCreate", async (message) => {
        if (!message.guild || !message.guild.available) return;
        let database = await Setup.findOne({ guild: message.guild.id });
        if (!database) return Setup.create({
            guild: message.guild.id,
            enable: false,
            channel: "",
            playmsg: "",
        });
        if (database.enable === false) return;

        let channel = await message.guild.channels.cache.get(database.channel);
        if (!channel) return;

        if (database.channel != message.channel.id) return;

        let guildModel = await GLang.findOne({ guild: message.guild.id });
        if (!guildModel) {
            guildModel = await GLang.create({
                guild: message.guild.id,
                language: "en",
            });
        }

        const { language } = guildModel;

        if (message.author.id === client.user.id) {
            await delay(3000);
                message.delete()
        }

        if (message.author.bot) return;

            const song = message.cleanContent;
            await message.delete();

            let voiceChannel = await message.member.voice.channel;
            if (!voiceChannel) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_voice")}`).then((msg) => { 
                setTimeout(() => {
                    msg.delete()
                }, 4000);
            });

            const player = await client.manager.create({
                guild: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
                selfDeafen: true,
            });

            const state = player.state;
            if (state != "CONNECTED") await player.connect();
            const res = await client.manager.search(song, message.author);
            if(res.loadType != "NO_MATCHES") {
                if(res.loadType == "TRACK_LOADED") {
                    player.queue.add(res.tracks[0]);
                    if(!player.playing) player.play();
                }
                else if(res.loadType == "PLAYLIST_LOADED") {
                    player.queue.add(res.tracks)
                    if(!player.playing) player.play();
                }
                else if(res.loadType == "SEARCH_RESULT") {
                    player.queue.add(res.tracks[0]);
                    if(!player.playing) player.play();
                }
                else if(res.loadType == "LOAD_FAILED") {
                    message.channel.send(`${client.i18n.get(language, "music", "play_fail")}`).then((msg) => { 
                        setTimeout(() => {
                            msg.delete()
                        }, 4000);
                    }).catch((e) => {});
                        player.destroy();
                }
            } else {
                message.channel.send(`${client.i18n.get(language, "music", "play_match")}`).then((msg) => { 
                    setTimeout(() => {
                        msg.delete()
                    }, 4000);
                }).catch((e) => {});
                    player.destroy();
                }

                if (player) {
                    client.UpdateQueueMsg(player);
                }
        });
};