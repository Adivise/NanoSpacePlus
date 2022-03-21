const delay = require("delay");
const { Permissions } = require("discord.js");

module.exports = async (client, oldState, newState) => {
	const player = client.manager?.players.get(newState.guild.id);
	if (!player) return;

	if (!newState.guild.members.cache.get(client.user.id).voice.channelId) player.destroy();

	if (newState.channelId && newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
		if (newState.guild.me.permissions.has(Permissions.FLAGS.SPEAK) || (newState.channel && newState.channel.permissionsFor(nS.guild.me).has(Permissions.FLAGS.SPEAK))) {
			newState.guild.me.voice.setSuppressed(false);
		}
	}

	if (oldState.id === client.user.id) return;
	if (!oldState.guild.members.cache.get(client.user.id).voice.channelId) return;

	if (player.twentyFourSeven) return;

	if (oldState.guild.members.cache.get(client.user.id).voice.channelId === oldState.channelId) {
		if (oldState.guild.me.voice?.channel && oldState.guild.me.voice.channel.members.filter((m) => !m.user.bot).size === 0) {

				await delay(client.config.LEAVE_TIMEOUT);

				const vcMembers = oldState.guild.me.voice.channel?.members.size;
				if (!vcMembers || vcMembers === 1) {
				const newPlayer = client.manager?.players.get(newState.guild.id)
				newPlayer ? player.destroy() : oldState.guild.me.voice.channel.leave();
				client.UpdateMusic(newPlayer);
			}
		}
	}
};