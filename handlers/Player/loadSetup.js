const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Setup = require("../../settings/models/Setup.js");
const Language = require("../../settings/models/Language.js");
const Premium = require('../../settings/models/Premium.js');
const Chart = require("../../settings/models/GuildChart.js");
const GChart = require("../../settings/models/GlobalChart.js");
const Useable = require("../../settings/models/Useable.js");

module.exports = async (client) => {

    const enable = client.button.song_request_on;

    client.enSwitch = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle[enable.pause.style])
                .setCustomId("spause")
                .setLabel(enable.pause.label)
                .setEmoji(enable.pause.emoji),
            new ButtonBuilder()
                .setStyle(ButtonStyle[enable.previous.style])
                .setCustomId("sprevious")
                .setLabel(enable.previous.label)
                .setEmoji(enable.previous.emoji),
            new ButtonBuilder()
                .setStyle(ButtonStyle[enable.stop.style])
                .setCustomId("sstop")
                .setLabel(enable.stop.label)
                .setEmoji(enable.stop.emoji),
            new ButtonBuilder()
                .setStyle(ButtonStyle[enable.skip.style])
                .setCustomId("sskip")
                .setLabel(enable.skip.label)
                .setEmoji(enable.skip.emoji),
            new ButtonBuilder()
                .setStyle(ButtonStyle[enable.loop.style])
                .setCustomId("sloop")
                .setLabel(enable.loop.label)
                .setEmoji(enable.loop.emoji),
        ]);

    const disable = client.button.song_request_off;

    client.diSwitch = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle[disable.pause.style])
                .setCustomId("spause")
                .setLabel(disable.pause.label)
                .setEmoji(disable.pause.emoji)
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle[disable.previous.style])
                .setCustomId("sprevious")
                .setLabel(disable.previous.label)
                .setEmoji(disable.previous.emoji)
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle[disable.stop.style])
                .setCustomId("sstop")
                .setLabel(disable.stop.label)
                .setEmoji(disable.stop.emoji)
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle[disable.skip.style])
                .setCustomId("sskip")
                .setLabel(disable.skip.label)
                .setEmoji(disable.skip.emoji)
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle[disable.loop.style])
                .setCustomId("sloop")
                .setLabel(disable.loop.label)
                .setEmoji(disable.loop.emoji)
                .setDisabled(true),
        ]);

        client.createSetup = async function (guildId) {
            const database = await Setup.findOne({ guild: guildId });
            if (!database) {
                const newSetup = await new Setup({
                    guild: guildId,
                    enable: false,
                    channel: "",
                    playmsg: "",
                });
                await newSetup.save();
            }
        }
    
        client.createLang = async function (guildId) {
            const database = await Language.findOne({ guild: guildId });
            if (!database) {
                const newLang = await Language.create({
                    guild: guildId,
                    language: "en",
                });
                await newLang.save();
            }
        };
    
        client.createPremium = async function (interaction, user) {
            const findUser = await Premium.findOne({ Id: interaction.user.id });
            if (!findUser) {
                const newUser = await Premium.create({ 
                    Id: interaction.user.id 
                });
                await newUser.save();
    
                interaction.client.premiums.set(interaction.user.id, newUser);
            }
        }

        client.interval = null;

        client.clearInterval = async function (interval) {
            clearInterval(interval);
        }

        client.addChart = async function (track, guild) {
            // update guild chart
            const database = await Chart.findOne({ guildId: guild });
            const track_id = await database.track_data.find(x => x.track_id === track.identifier);
        
            const object = {
                track_id: track.identifier,
                track_title: track.title,
                track_url: track.uri,
                track_duration: track.duration,
                track_count: 1,
            };
        
            if (track_id) {
                await Chart.updateOne({ guildId: guild, "track_data.track_id": track.identifier }, { $inc: { "track_data.$.track_count": 1 } });
            } else {
                database.track_data.push(object);
                await database.save();
            }
        }

        client.createChart = async function (interaction) {
            const find = await Chart.findOne({ guildId: interaction.guild.id });
            if (!find) {
                const newGuild = await Chart.create({ 
                    guildId: interaction.guild.id,
                    data: []
                });
                await newGuild.save();
            }
        }
        
        client.addGChart = async function (track) {
            // update global chart
            const database = await GChart.findOne({ track_id: track.identifier });
            if (database) {
                database.track_count += 1;
                await database.save();
            } else {
                const newTrack = await GChart.create({
                    track_id: track.identifier,
                    track_title: track.title,
                    track_url: track.uri,
                    track_duration: track.duration,
                    track_count: 1,
                });
                await newTrack.save();
            }
        }

        client.addUseable = async function (name) {
            const database = await Useable.findOne({ name: name });
            if (database) {
                database.count += 1;
                await database.save();
            } else {
                const newUseable = await Useable.create({
                    name: name,
                    count: 1,
                });
                await newUseable.save();
            }
        }
};