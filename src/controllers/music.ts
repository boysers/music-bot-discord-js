import { Message, MessageEmbed } from 'discord.js';
import ytdl from 'ytdl-core';
import { IServer } from '../interfaces/IServer';
import { playVoiceConnection } from '../services/playVoiceConnection';

export const server: IServer = {
  id: process.env.SERVER,
  dispatcher: null,
  queues: []
};

export class Player {
  public async play(message: Message, url: string): Promise<void> {
    if (!url) {
      message.channel.send('Vous devez fournir un lien');
      return;
    }

    if (!message.member.voice.channel) {
      message.channel.send(
        'Vous devez être dans un channel vocal pour play le bot !'
      );
      return;
    } else if (!message.member.voice.channel.joinable) {
      message.channel.send(
        `<@${message.client.user.id}> n'est pas autorisé à rejoindre ce channel vocal.`
      );
      return;
    }

    let title: string;
    try {
      ytdl.getVideoID(url);
      title = (await ytdl.getInfo(url)).videoDetails.title;
    } catch (error) {
      message.channel.send(error.message);
      return;
    }

    message.client.user.setStatus('online');

    server.queues.push({ url: url, title });

    if (message.client.voice.connections.size === 0) {
      message.member.voice.channel.join().then((connection) => {
        playVoiceConnection(connection, message, server, 'lowestaudio');
      });
      return;
    }
  }

  public skip(message: Message): void {
    if (message.client.voice.connections.size === 0) return;

    if (!message.member.voice.channel) {
      message.channel.send('Vous devez être dans un channel vocal pour skip !');
      return;
    }

    if (server.dispatcher) server.dispatcher.end();
    message.channel.send('Skip');
  }

  public stop(message: Message) {
    if (message.client.voice.connections.size !== 0) {
      if (!message.member.voice.channel) {
        message.channel.send(
          'Vous devez être dans le channel vocal pour stopper le bot !'
        );

        return;
      }

      for (let i = server.queues.length - 1; i >= 0; i--) {
        server.queues.splice(i, 1);
      }

      server.dispatcher.end();
      message.channel.send('Stop!');
      message.client.user.setStatus('idle');
      message.guild.voice.connection.disconnect();

      return;
    }
  }

  public list(message: Message): void {
    if (message.client.voice.connections.size === 0) return;

    if (server.queues.length === 0) return;

    const VideoEmbed = new MessageEmbed()
      .setTitle('Liste de vidéos en attente')
      .setColor('#900C3F');

    server.queues.forEach((video, index) => {
      VideoEmbed.addField(`${++index} : ${video.title}`, video.url, false);
    });

    message.channel.send(VideoEmbed);
  }

  public help(message: Message): void {
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

    message.channel.send(HelpEmbed);
  }
}
