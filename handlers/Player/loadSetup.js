const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
  
  /**
   *
   * @param {Client} client
   */

module.exports = async (client) => {

    client.enSwitch = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setCustomId("spause")
                .setEmoji("⏯"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("sprevious")
                .setEmoji("⬅"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("sstop")
                .setEmoji("⏹"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("sskip")
                .setEmoji("➡"),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setCustomId("sloop")
                .setEmoji("🔄"),
        ]);

    client.diSwitch = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("spause")
                .setEmoji("⏯")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sprevious")
                .setEmoji("⬅")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sstop")
                .setEmoji("⏹")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sskip")
                .setEmoji("➡")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("sloop")
                .setEmoji("🔄")
                .setDisabled(true),
        ]);
};