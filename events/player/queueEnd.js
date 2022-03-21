const { MessageEmbed, Client } = require("discord.js");
const GLang = require("../../settings/models/Language.js");
const { Player } = require("erela.js");

/**
 * 
 * @param {Client} client 
 * @param {Player} player 
 * @returns 
 */

module.exports = async (client, player) => {
	const channel = client.channels.cache.get(player.textChannel);
	if (!channel) return;

	if (player.twentyFourSeven) return;

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

		/////////// Update Music Setup ///////////

	const embed = new MessageEmbed()
		.setColor(client.color)
		.setDescription(`${client.i18n.get(language, "player", "queue_end_desc")}`);

	if(channel) channel.send({ embeds: [embed] });
	player.destroy();
}