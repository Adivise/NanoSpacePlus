const { PermissionsBitField } = require("discord.js");
const Profile = require("../../settings/models/Profile.js");

module.exports = async (client, oldState, newState) => {
	const player = client.manager?.players.get(newState.guild.id);
	if (!player) return;

	if (!newState.guild.members.cache.get(client.user.id).voice.channelId) { 
		player.destroy();
		client.UpdateMusic(player);
        client.clearInterval(client.interval);
	}

	if (newState.channelId && newState.channel.type == 13 && newState.guild.members.me.voice.suppress) {
		if (newState.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak) || (newState.channel && newState.channel.permissionsFor(nS.guild.members.me).has(PermissionsBitField.Flags.Speak))) {
			newState.guild.members.me.voice.setSuppressed(false);
		}
	}

	// add every 1 minute
	setInterval(async () => {
		const player = client.manager?.players.get(newState.guild.id);
		if (!player) return;
		if (player.playing === false) return;

		if (newState.guild.members.cache.get(client.user.id).voice.channelId == newState.channelId) {
			const channel = newState.guild.channels.cache.get(newState.channelId);
			if (!channel) return;

			const filters = channel.members.filter(m => !m.user.bot);
			const members = filters.map(m => m.user.id);
			if (!members) return;
			try {
				members.forEach(async (member) => {
					const profile = await Profile.findOne({ userId: member });
					if (profile) {
						profile.listenTime += 60000;
						await profile.save();
					} else {
						const newProfile = new Profile({
							userId: member,
							playedCount: 0,
							useCount: 0,
							listenTime: 60000,
							playedHistory: [],
						});
						await newProfile.save();
					}
				});
			} catch (e) {
				///
			}
		}
	}, 60000);

	if (oldState.id === client.user.id) return;
	if (!oldState.guild.members.cache.get(client.user.id).voice.channelId) return;

	if (player.twentyFourSeven) return;

	if (oldState.guild.members.cache.get(client.user.id).voice.channelId === oldState.channelId) {
		if (oldState.guild.members.me.voice?.channel && oldState.guild.members.me.voice.channel.members.filter((m) => !m.user.bot).size === 0) {

			await delay(client.config.LEAVE_TIMEOUT);

			const vcMembers = oldState.guild.members.me.voice.channel?.members.size;
			if (!vcMembers || vcMembers === 1) {
				if(!player) return;
				await player.destroy();
				await client.UpdateMusic(player);
				await client.clearInterval(client.interval);
			}
		}
	}
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}