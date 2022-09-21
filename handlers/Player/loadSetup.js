const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Setup = require("../../settings/models/Setup.js");
const Language = require("../../settings/models/Language.js");
const Premium = require('../../settings/models/Premium.js');

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

};