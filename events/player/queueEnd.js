const { EmbedBuilder } = require("discord.js");
const GLang = require("../../settings/models/Language.js");
const Setup = require("../../settings/models/Setup.js");

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
	await client.clearInterval(client.interval);

	const db = await Setup.findOne({ guild: channel.guild.id });
	if (db.enable) return player.destroy();

	////////// End Update Music Setup //////////

	const embed = new EmbedBuilder()
		.setColor(client.color)
		.setDescription(`${client.i18n.get(language, "player", "queue_end_desc")}`);

	await channel.send({ embeds: [embed] });
	return player.destroy();
}