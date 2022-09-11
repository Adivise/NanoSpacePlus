const { EmbedBuilder } = require("discord.js");
const { white, red } = require("chalk");
const GLang = require("../../settings/models/Language.js");

module.exports = async (client, player, track, payload) => {

    console.error(payload.error);

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

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

    /////////// Update Music Setup ///////////

	  await client.UpdateMusic(player);
    await client.clearInterval(client.interval);

    /////////// Update Music Setup ///////////

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${client.i18n.get(language, "player", "error_desc")}`);

    channel.send({ embeds: [embed] });

    console.log(white('[') + red('DEBUG') + white('] ') + red('Track Error in ') + white(player.guild) + red(' Auto-Leaved!'));
    if (!player.voiceChannel) player.destroy();

}