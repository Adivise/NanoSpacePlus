const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const formatduration = require('../../structures/FormatDuration.js');
const GLang = require("../../settings/models/Language.js");
const Setup = require("../../settings/models/Setup.js");
    
module.exports = async (client, player, track, payload) => {
    if(!player) return;

    /////////// Update Music Setup ///////////

    await client.UpdateQueueMsg(player);

    /////////// Update Music Setup ///////////

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    let data = await Setup.findOne({ guild: channel.guild.id });
    if (player.textChannel === data.channel) return;

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
  
    const embeded = new MessageEmbed()
      .setAuthor({ name: `${client.i18n.get(language, "player", "track_title")}`, iconURL: `${client.i18n.get(language, "player", "track_icon")}` })
      .setDescription(`**[${track.title}](${track.uri})**`)
      .setColor(client.color)
      .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
      .addField(`${client.i18n.get(language, "player", "author_title")}`, `${track.author}`, true)
      .addField(`${client.i18n.get(language, "player", "request_title")}`, `${track.requester}`, true)
      .addField(`${client.i18n.get(language, "player", "volume_title")}`, `${player.volume}%`, true)
      .addField(`${client.i18n.get(language, "player", "queue_title")}`, `${player.queue.length}`, true)
      .addField(`${client.i18n.get(language, "player", "duration_title")}`, `${formatduration(track.duration, true)}`, true)
      .addField(`${client.i18n.get(language, "player", "total_duration_title")}`, `${formatduration(player.queue.duration)}`, true)
      .addField(`${client.i18n.get(language, "player", "current_duration_title", {
        current_duration: formatduration(track.duration, true),
      })}`, `\`\`\`🔴 | 🎶──────────────────────────────\`\`\``)
      .setTimestamp();
    
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("pause")
          .setEmoji("⏯")
          .setStyle("SUCCESS")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("replay")
          .setEmoji("⬅")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("stop")
          .setEmoji("⏹")
          .setStyle("DANGER")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("skip")
          .setEmoji("➡")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("loop")
          .setEmoji("🔄")
          .setStyle("SUCCESS")
      )
    
    const row2 = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("shuffle")
          .setEmoji("🔀")
          .setStyle("SUCCESS")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("voldown")
          .setEmoji("🔉")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("clear")
          .setEmoji("🗑")
          .setStyle("DANGER")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("volup")
          .setEmoji("🔊")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("queue")
          .setEmoji("📋")
          .setStyle("SUCCESS")
      )
   
    const nplaying = await client.channels.cache.get(player.textChannel).send({ embeds: [embeded], components: [row, row2] });

    const filter = (message) => {
      if(message.guild.me.voice.channel && message.guild.me.voice.channelId === message.member.voice.channelId) return true;
      else {
        message.reply({ content: `${client.i18n.get(language, "player", "join_voice")}`, ephemeral: true });
      }
    };
    const collector = nplaying.createMessageComponentCollector({ filter, time: track.duration });

    collector.on('collect', async (message) => {
      const id = message.customId;
      if(id === "pause") {
      if(!player) {
          collector.stop();
      }
        await player.pause(!player.paused);
        const uni = player.paused ? `${client.i18n.get(language, "player", "switch_pause")}` : `${client.i18n.get(language, "player", "switch_resume")}`;

        const embed = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "player", "pause_msg", {
              pause: uni,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      } else if (id === "skip") {
        if(!player) {
          collector.stop();
        }
        if (player.queue.size == 0) {
            await player.destroy();
            await client.UpdateMusic(player);

            const embed = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            await nplaying.edit({ embeds: [embeded], components: [] });
            message.reply({ embeds: [embed], ephemeral: true });
        } else {
            await player.stop();

            const embed = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                .setColor(client.color);
    
            await nplaying.edit({ embeds: [embeded], components: [] });
            message.reply({ embeds: [embed], ephemeral: true });
        }
      } else if(id === "stop") {
        if(!player) {
          collector.stop();
        }

        await player.destroy();
        await client.UpdateMusic(player);

        const embed = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "player", "stop_msg")}`)
            .setColor(client.color);
        
        await nplaying.edit({ embeds: [embeded], components: [] });
        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "shuffle") {
        if(!player) {
          collector.stop();
        }
        await player.queue.shuffle();

        const embed = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "player", "shuffle_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "loop") {
        if(!player) {
          collector.stop();
        }
        await player.setQueueRepeat(!player.queueRepeat);
        const uni = player.queueRepeat ? `${client.i18n.get(language, "player", "switch_enable")}` : `${client.i18n.get(language, "player", "switch_disable")}`;

        const embed = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "player", "repeat_msg", {
              loop: uni,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "volup") {
        if(!player) {
          collector.stop();
        }
        await player.setVolume(player.volume + 5);

        const embed = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "player", "volup_msg", {
              volume: player.volume,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      else if(id === "voldown") {
        if(!player) {
          collector.stop();
        }
        await player.setVolume(player.volume - 5);

        const embed = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "player", "voldown_msg", {
              volume: player.volume,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      else if(id === "replay") {
        if(!player) {
          collector.stop();
        }
        await player.seek(0);

        const embed = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "player", "replay_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      else if(id === "queue") {
        if(!player) {
          collector.stop();
        }
        const song = player.queue.current;
        const qduration = `${formatduration(player.queue.duration)}`;
        const thumbnail = `https://img.youtube.com/vi/${song.identifier}/mqdefault.jpg`;
    
        let pagesNum = Math.ceil(player.queue.length / 10);
        if(pagesNum === 0) pagesNum = 1;
    
        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
          const song = player.queue[i];
          songStrings.push(
            `**${i + 1}.** [${song.title}](${song.uri}) \`[${formatduration(song.duration)}]\` • ${song.requester}
            `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
          const str = songStrings.slice(i * 10, i * 10 + 10).join('');
    
          const embed = new MessageEmbed()
            .setAuthor({ name: `${client.i18n.get(language, "player", "queue_author", {
              guild: message.guild.name,
            })}`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setThumbnail(thumbnail)
            .setColor(client.color)
            .setDescription(`${client.i18n.get(language, "player", "queue_description", {
              track: song.title,
              track_url: song.uri,
              duration: formatduration(song.duration),
              requester: song.requester,
              list_song: str == '' ? '  Nothing' : '\n' + str,
            })}`)
            .setFooter({ text: `${client.i18n.get(language, "player", "queue_footer", {
              page: i + 1,
              pages: pagesNum,
              queue_lang: player.queue.length,
              total_duration: qduration,
            })}` });
    
          pages.push(embed);
        }
        message.reply({ embeds: [pages[0]], ephemeral: true });
      }
      else if(id === "clear") {
        if(!player) {
          collector.stop();
        }
        await player.queue.clear();

        const embed = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "player", "clear_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
    });
    collector.on('end', async (collected, reason) => {
      if(reason === "time") {
        nplaying.edit({ embeds: [embeded], components: [] })
      }
    });
}
