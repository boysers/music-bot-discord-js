import { Message, MessageEmbed } from 'discord.js';
import ytdl from 'ytdl-core';
import { GuildServerList } from '../interfaces/GuildServerList.interface';
import { playVoiceConnection } from '../services/playVoiceConnection';

const servers: GuildServerList = {};

export class Player {
  public async play(message: Message, url: string): Promise<void> {
    try {
      if (!url) return;

      if (!message.member.voice.channel) {
        return;
      } else if (!message.member.voice.channel.joinable) return;

      ytdl.getVideoID(url);
      const title = (await ytdl.getInfo(url)).videoDetails.title;

      if (!servers[message.guild.id]) {
        servers[message.guild.id] = {
          queue: []
        };
      }

      message.client.user.setStatus('online');

      const server = servers[message.guild.id];

      server.queue.push({ url: url, title });

      if (!message.guild.me.voice.channel) {
        message.member.voice.channel.join().then((connection) => {
          playVoiceConnection(connection, message, server, 'lowestaudio');
        });
        return;
      }
    } catch (error) {
      console.log('Error !play :', error);
    }
  }

  public skip(message: Message): void {
    try {
      if (!message.guild.me.voice.channel) return;

      if (!message.member.voice.channel) return;

      const server = servers[message.guild.id];

      if (server.dispatcher) server.dispatcher.end();
    } catch (error) {
      console.log('Error !skip :', error.message);
    }
  }

  public async stop(message: Message): Promise<void> {
    try {
      if (!message.guild.me.voice.channel) return;

      if (!message.member.voice.channel) return;

      const server = servers[message.guild.id];

      if (server.dispatcher) server.dispatcher.end();
      (await message.member.voice.channel.join()).disconnect();

      delete servers[message.guild.id];
      await message.client.user.setStatus('idle');
    } catch (error) {
      console.log('Error !stop :', error.message);
    }
  }

  public async list(message: Message): Promise<void> {
    try {
      if (!message.guild.me.voice.channel) return;

      if (!message.member.voice.channel) return;

      const server = servers[message.guild.id];

      if (server.queue.length === 0) return;

      const VideoEmbed = new MessageEmbed()
        .setTitle('Liste de vidéos en attente')
        .setColor('#900C3F');

      server.queue.forEach((video, index) => {
        VideoEmbed.addField(`${++index} : ${video.title}`, video.url, false);
      });

      await message.channel.send(VideoEmbed);
    } catch (error) {
      console.log('Error !list :', error.message);
    }
  }

  public async help(message: Message): Promise<void> {
    try {
      const HelpEmbed = new MessageEmbed()
        .setTitle('Liste de commandes du bot de music')
        .setColor('#FF5733')
        .addFields(
          {
            name: '!help',
            value: 'liste de commandes du bot de music',
            inline: false
          },
          {
            name: '!play `URL`',
            value: "démarre la video ou mettra la vidéo sur liste d'attente",
            inline: false
          },
          {
            name: '!list',
            value: 'liste de vidéos en attente ',
            inline: false
          },
          {
            name: '!skip',
            value: 'retire la première video de la liste de mise en attente',
            inline: false
          },
          {
            name: '!stop',
            value:
              "retire le bot du channel et enlève toutes les vidéos de la liste d'attente",
            inline: false
          }
        );

      await message.channel.send(HelpEmbed);
    } catch (error) {
      console.log('Error !help :', error.message);
    }
  }
}
