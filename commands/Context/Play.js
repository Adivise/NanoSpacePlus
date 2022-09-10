const { ContextMenuInteraction, EmbedBuilder, PermissionsBitField, ApplicationCommandType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = { 
    name: "Context | Play",
    type: ApplicationCommandType.Message,
    /**
     * @param {ContextMenuInteraction} interaction
     */
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const value = (interaction.channel.messages.cache.get(interaction.targetId).content ?? await interaction.channel.messages.fetch(interaction.targetId));
        if (!value.startsWith('https')) return interaction.editReply(`${client.i18n.get(language, "music", "play_startwith")}`);

        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "play_loading")}`);
        
        const { channel } = interaction.member.voice;
		if (!channel) return msg.edit(`${client.i18n.get(language, "music", "play_invoice")}`);
		if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Connect)) return msg.edit(`${client.i18n.get(language, "music", "play_join")}`);
		if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Speak)) return msg.edit(`${client.i18n.get(language, "music", "play_speak")}`);

        const player = await client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true,
        });
        
        const state = player.state;
        if (state != "CONNECTED") await player.connect();
        const res = await client.manager.search(value, interaction.user);
        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                player.queue.add(res.tracks[0]);
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "play_track", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].duration, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            }
            else if(res.loadType == "PLAYLIST_LOADED") {
                player.queue.add(res.tracks)
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "play_playlist", {
                        title: res.playlist.name,
                        url: value,
                        duration: convertTime(res.playlist.duration),
                        songs: res.tracks.length,
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            }
            else if(res.loadType == "SEARCH_RESULT") {
                player.queue.add(res.tracks[0]);
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "play_result", {
                        title: res.tracks[0].title,
                        url: res.tracks[0].uri,
                        duration: convertTime(res.tracks[0].duration, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            }
            else if(res.loadType == "LOAD_FAILED") {
                msg.edit(`${client.i18n.get(language, "music", "play_fail")}`); 
                player.destroy();
            }
        }
        else {
            msg.edit(`${client.i18n.get(language, "music", "play_match")}`); 
            player.destroy();
        }
    }
}