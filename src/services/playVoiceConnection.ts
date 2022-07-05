import { Message, VoiceConnection } from 'discord.js';
import ytdl from 'ytdl-core';
import { GuildServer } from '../interfaces/GuildServer.interface';

export function playVoiceConnection(
  connection: VoiceConnection,
  message: Message,
  server: GuildServer,
  quality: 'lowestaudio' | 'highestaudio'
): void {
  server.dispatcher = connection.play(
    ytdl(server.queue[0].url, { filter: 'audioonly', quality })
  );

  server.queue.shift();

  server.dispatcher.on('finish', () => {
    if (server.queue[0]) {
      playVoiceConnection(connection, message, server, quality);
    } else {
      connection.disconnect();
    }
  });
}
