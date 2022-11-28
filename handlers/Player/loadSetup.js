const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const Setup = require("../../settings/models/Setup.js");
const Language = require("../../settings/models/Language.js");
const Premium = require('../../settings/models/Premium.js');
const Chart = require("../../settings/models/GuildChart.js");
const GChart = require("../../settings/models/GlobalChart.js");
const Stats = require("../../settings/models/CommandStats.js");
const Profile = require("../../settings/models/Profile.js");

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

        client.createDatabase = async function (interaction) {
            const find_setup = await Setup.findOne({ guild: interaction.guild.id });
            if (!find_setup) {
                const newSetup = await new Setup({
                    guild: interaction.guild.id,
                    enable: false,
                    channel: "",
                    playmsg: "",
                });
                await newSetup.save();
            }

            const find_lang = await Language.findOne({ guild: interaction.guild.id });
            if (!find_lang) {
                const newLang = await Language.create({
                    guild: interaction.guild.id,
                    language: "en",
                });
                await newLang.save();
            }

            const find_premium = await Premium.findOne({ Id: interaction.user.id });
            if (!find_premium) {
                const newPremium = await Premium.create({ 
                    Id: interaction.user.id 
                });
                await newPremium.save();
    
                interaction.client.premiums.set(interaction.user.id, newPremium);
            }

            const CGuild = await Chart.findOne({ guildId: interaction.guild.id });
            if (!CGuild) {
                const newChart = await Chart.create({ 
                    guildId: interaction.guild.id,
                    playedHistory: []
                });
                await newChart.save();
            }

            const CProfile = await Profile.findOne({ userId: interaction.user.id });
            if (!CProfile) {
                const newUser = await Profile.create({ 
                    userId: interaction.user.id,
                    playedCount: 0,
                    useCount: 0,
                    listenTime: 0,
                    playedHistory: [],
                });
                await newUser.save();
            }
        }

        client.createMessage = async function (message) {
            const find_setup = await Setup.findOne({ guild: message.guild.id });
            if (!find_setup) {
                const newSetup = await new Setup({
                    guild: message.guild.id,
                    enable: false,
                    channel: "",
                    playmsg: "",
                });
                await newSetup.save();
            }
            
            const find_premium = await Premium.findOne({ Id: message.author.id });
            if (!find_premium) {
                const newPremium = await Premium.create({ 
                    Id: message.author.id 
                });
                await newPremium.save();
    
                message.client.premiums.set(message.author.id, newPremium);
            }

            const CProfile = await Profile.findOne({ userId: message.author.id });
            if (!CProfile) {
                const newUser = await Profile.create({ 
                    userId: message.author.id,
                    playedCount: 0,
                    useCount: 0,
                    listenTime: 0,
                    playedHistory: [],
                });
                await newUser.save();
            }
        }

        client.interval = null;

        client.clearInterval = async function (interval) {
            clearInterval(interval);
        }

        client.addChart = async function (player, track) {
            // Guild
            const CGuild = await Chart.findOne({ guildId: player.guild });
            const TGuild = await CGuild.playedHistory.find(x => x.track_id === track.identifier);
        
            if (TGuild) {
                // Played History
                await Chart.updateOne({ guildId: player.guild, "playedHistory.track_id": track.identifier }, { $inc: { "playedHistory.$.track_count": 1 } });
            } else {
                // Played History
                CGuild.playedHistory.push({
                    track_id: track.identifier,
                    track_title: track.title,
                    track_url: track.uri,
                    track_duration: track.duration,
                    track_count: 1,
                });
                await CGuild.save();
            }
            
            // Profile
            const CProfile = await Profile.findOne({ userId: track.requester.id });
            const TProfile = await CProfile.playedHistory.find(x => x.track_id === track.identifier);

            if (TProfile) {
                // PlayedHistory
                await Profile.updateOne({ userId: track.requester.id, "playedHistory.track_id": track.identifier }, { $inc: { "playedHistory.$.track_count": 1 } });
                // PlayedCount
                await Profile.updateOne({ userId: track.requester.id }, { $inc: { playedCount: 1 } });
            } else {
                // PlayedHistory
                CProfile.playedHistory.push({
                    track_id: track.identifier,
                    track_title: track.title,
                    track_url: track.uri,
                    track_duration: track.duration,
                    track_count: 1,
                });
                await CProfile.save();
                // PlayedCount
                await Profile.updateOne({ userId: track.requester.id }, { $inc: { playedCount: 1 } });
            }

            // GLobal
            const CGlobal = await GChart.findOne({ track_id: track.identifier });
            if (CGlobal) {
                CGlobal.track_count += 1;
                await CGlobal.save();
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

        client.addStats = async function (name, interaction) {
            const BStats = await Stats.findOne({ name: name });
            if (BStats) {
                BStats.count += 1;
                await BStats.save();
            } else {
                const newStats = await Stats.create({
                    name: name,
                    count: 1,
                });
                await newStats.save();
            }

            const PStats = await Profile.findOne({ userId: interaction.user.id });
            if (PStats) {
                PStats.useCount += 1;
                await PStats.save();
            } else {
                const newStats = await Profile.create({
                    userId: interaction.user.id,
                    useCount: 1,
                });
                await newStats.save();
            }
        }
};