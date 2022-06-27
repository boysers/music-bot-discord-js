/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Message, MessageEmbed, VoiceConnection } from 'discord.js';
import ytdl from 'ytdl-core';
import express from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/', (_req, res) => {
  res.status(200).json({ status: 'ok!' });
});

const bot = new Client();

const { TOKEN, PORT } = process.env;
const PREFIX = '!';

interface IServer {
  id: string;
  dispatcher: any;
  queue: { title: string; url: string }[];
}

const server: IServer = {
  id: process.env.SERVER,
  dispatcher: null,
  queue: []
};

bot.once('ready', () => {
  console.log('Ready!');
});

function play(connection: VoiceConnection, message: Message) {
  server.dispatcher = connection.play(
    ytdl(server.queue[0].url, { filter: 'audioonly', quality: 'lowestaudio' })
  );

  if (server.queue[0].url === 'https://www.youtube.com/watch?v=elJ-51qPkIU') {
    message.channel.send(`@here t'inquiète pas ÇA VA RENTRER`.toLowerCase());
  }

  server.queue.shift();

  server.dispatcher.on('finish', () => {
    if (server.queue[0]) {
      play(connection, message);
    } else {
      connection.disconnect();
    }
  });
}

bot.on('message', async (message) => {
  const args = message.content.substring(PREFIX.length).split(' ');
  let title: string;

  switch (args[0]) {
    case 'play':
      if (!args[1]) {
        message.channel.send('Vous devez fournir un lien');
        return;
      }

      if (!message.member.voice.channel) {
        message.channel.send(
          'Vous devez être dans un channel vocal pour play le bot !'
        );
        return;
      }

      try {
        ytdl.getVideoID(args[1]);
        title = (await ytdl.getInfo(args[1])).videoDetails.title;
      } catch (error) {
        message.channel.send(error.message);
        return;
      }

      server.queue.push({ url: args[1], title });

      if (message.client.voice.connections.size === 0) {
        message.member.voice.channel.join().then((connection) => {
          play(connection, message);
        });
      }

      break;

    case 'skip':
      if (message.client.voice.connections.size === 0) {
        return;
      }

      if (server.dispatcher) server.dispatcher.end();
      message.channel.send('Skip');

      break;

    case 'stop':
      if (message.client.voice.connections.size !== 0) {
        for (let i = server.queue.length - 1; i >= 0; i--) {
          server.queue.splice(i, 1);
        }

        server.dispatcher.end();
        message.channel.send('Stop!');
        // console.log('stopped the queue');
      }

      if (message.client.voice.connections.size !== 0)
        message.guild.voice.connection.disconnect();

      break;

    case 'list':
      if (message.client.voice.connections.size === 0) {
        return;
      }

      const VideoEmbed = new MessageEmbed()
        .setTitle('Liste de vidéos en attente')
        .setColor('#900C3F');

      server.queue.forEach((video, index) => {
        const title = `${++index} : ${video.title}`;

        VideoEmbed.addField(title, video.url, false);
      });

      message.channel.send(VideoEmbed);

      break;

    case 'help':
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

      break;
  }
});

bot.login(TOKEN);

app.listen(PORT, () => console.log('Server listening port', PORT));
