const Setup = require("../../settings/models/Setup.js");

module.exports = async (client, channel) => {
    if (channel.type == 2) {
        if (channel.members.has(client.user.id)) {
            const player = client.manager.players.get(channel.guild.id);
            if (channel.id === player.voiceChannel) {
                if (player) player.destroy();
            }
        }
    }

    if (channel.type == 13) {
        if (channel.members.has(client.user.id)) {
            const player = client.manager.players.get(channel.guild.id);
            if (channel.id === player.voiceChannel) {
                if (player) player.destroy();
            }
        }
    }

    if (channel.type == 0) {
        const db = await Setup.findOne({ guild: channel.guild.id });
        const player = client.manager.players.get(channel.guild.id);
        if (db.channel == channel.id) {
            db.enable = false;
            await db.save();
            if (player) player.destroy();
        }
    }
};