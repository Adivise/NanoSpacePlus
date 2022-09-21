const { EmbedBuilder } = require("discord.js");
const GLang = require("../../settings/models/Language.js");
const Setup = require("../../settings/models/Setup.js");

module.exports = async (client, player) => {
	const channel = client.channels.cache.get(player.textChannel);
	if (!channel) return;

	if (player.twentyFourSeven) return;

	const guildModel = await GLang.findOne({ guild: channel.guild.id });
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