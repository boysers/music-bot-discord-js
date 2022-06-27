import { Message, VoiceConnection } from 'discord.js';
import ytdl from 'ytdl-core';
import { IServer } from '../controllers/music';

export function playVoiceConnection(
  connection: VoiceConnection,
  message: Message,
  server: IServer
) {
  server.dispatcher = connection.play(
    ytdl(server.queue[0].url, { filter: 'audioonly', quality: 'highestaudio' })
  );

  if (server.queue[0].url === 'https://www.youtube.com/watch?v=elJ-51qPkIU') {
    message.channel.send(`@here t'inquiète pas ÇA VA RENTRER`.toLowerCase());
  }

  server.queue.shift();

  server.dispatcher.on('finish', () => {
    if (server.queue[0]) {
      playVoiceConnection(connection, message, server);
    } else {
      message.client.user.setStatus('idle');
      connection.disconnect();
    }
  });
}
