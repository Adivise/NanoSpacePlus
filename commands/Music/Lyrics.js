const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const lyricsfinder = require('lyrics-finder');

module.exports = {
    name: ["music", "lyric"],
    description: "Display lyrics of a song.",
    category: "Music",
    options: [
        {
            name: "input",
            description: "Song name to return lyrics for.",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "lyrics_loading")}`);
        const value = interaction.options.getString("input");

        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        let song = value;
            let CurrentSong = player.queue.current;
        if (!song && CurrentSong) song = CurrentSong.title;

        let lyrics = null;

        try {
            lyrics = await lyricsfinder(song, "");
            if (!lyrics) return msg.edit(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
        } catch (err) {
            console.log(err);
            return msg.edit(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
        }
        let lyricsEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`${client.i18n.get(language, "music", "lyrics_title", {
                song: song
            })}`)
            .setDescription(`${lyrics}`)
            .setFooter({ text: `Requested by ${interaction.user.username}`})
            .setTimestamp();

        if (lyrics.length > 4096) {
            lyricsEmbed.setDescription(`${client.i18n.get(language, "music", "lyrics_toolong")}`);
        }

        msg.edit({ content: ' ', embeds: [lyricsEmbed] });
        
    }
}
