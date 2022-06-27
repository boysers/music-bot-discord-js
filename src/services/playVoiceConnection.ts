import { Message, VoiceConnection } from 'discord.js';
import ytdl from 'ytdl-core';
import { IServer } from '../interfaces/IServer';

export function playVoiceConnection(
  connection: VoiceConnection,
  message: Message,
  server: IServer,
  quality: 'lowestaudio' | 'highestaudio'
): void {
  server.dispatcher = connection.play(
    ytdl(server.queues[0].url, { filter: 'audioonly', quality })
  );

  server.queues.shift();

  server.dispatcher.on('finish', () => {
    if (server.queues[0]) {
      playVoiceConnection(connection, message, server, quality);
    } else {
      message.client.user.setStatus('idle');
      connection.disconnect();
    }
  });
}
