const { Client, MessageActionRow, MessageButton } = require("discord.js");
  
  /**
   *
   * @param {Client} client
   */

module.exports = async (client) => {

    client.enSwitch = new MessageActionRow()
        .addComponents([
            new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId("spause")
                .setEmoji("⏯"),
            new MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("sprevious")
                .setEmoji("⬅"),
            new MessageButton()
                .setStyle("DANGER")
                .setCustomId("sstop")
                .setEmoji("⏹"),
            new MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("sskip")
                .setEmoji("➡"),
            new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId("sloop")
                .setEmoji("🔄"),
        ]);

    client.diSwitch = new MessageActionRow()
        .addComponents([
            new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("spause")
                .setEmoji("⏯")
                .setDisabled(true),
            new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("sprevious")
                .setEmoji("⬅")
                .setDisabled(true),
            new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("sstop")
                .setEmoji("⏹")
                .setDisabled(true),
            new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("sskip")
                .setEmoji("➡")
                .setDisabled(true),
            new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("sloop")
                .setEmoji("🔄")
                .setDisabled(true),
        ]);
};