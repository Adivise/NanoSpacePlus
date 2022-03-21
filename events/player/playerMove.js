const { MessageEmbed } = require("discord.js");
const Client = require("../../index.js");
const { Player } = require("erela.js");
const GLang = require("../../settings/models/Language.js");

    /**
     * 
     * @param {Client} client 
     * @param {Player} player 
     * @param {String} oldChannel
     * @param {String} newChannel
     */

module.exports = async (client, player, oldChannel, newChannel) => {
      const guild = client.guilds.cache.get(player.guild)
      if(!guild) return;

      const channel = guild.channels.cache.get(player.textChannel);
      if (!channel) return;

      /////////// Update Music Setup ///////////

      await client.UpdateMusic(player);

      ////////// End Update Music Setup //////////

      let guildModel = await GLang.findOne({
        guild: channel.guild.id,
      });
      if (!guildModel) {
        guildModel = await GLang.create({
          guild: channel.guild.id,
          language: "en",
        });
      }
      const { language } = guildModel;

        if(oldChannel === newChannel) return;
        if(newChannel === null || !newChannel) {
        if(!player) return;

        const embed = new MessageEmbed()
          .setTitle(`${client.i18n.get(language, "player", "dis_title")}`)
          .setDescription(`${client.i18n.get(language, "player", "dis_desc", {
            voice: oldChannel,
          })}`)
          .setColor(client.color)

        if(channel) channel.send({ embeds: [embed] });
        player.destroy();
      } else {
        player.voiceChannel = newChannel;

        const embed = new MessageEmbed()
          .setTitle(`${client.i18n.get(language, "player", "leave_title")}`)
          .setDescription(`${client.i18n.get(language, "player", "leave_desc")}`)
          .setColor(client.color)
        
        if(channel) channel.send({ embeds: [embed] });
        player.destroy();
      }

}