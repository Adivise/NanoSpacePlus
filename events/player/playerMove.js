const Client = require("../../index.js");
const { Player } = require("erela.js");

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
        await client.clearInterval(client.interval);

        ////////// End Update Music Setup //////////

        if(oldChannel === newChannel) return;
        if(newChannel === null || !newChannel) {
        if(!player) return;

        player.destroy();
      } else {
        player.voiceChannel = newChannel;
        player.destroy();
      }

}