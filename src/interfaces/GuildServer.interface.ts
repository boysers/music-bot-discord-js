import { StreamDispatcher } from 'discord.js';

export interface GuildServer {
  queue: Queue[];
  dispatcher?: StreamDispatcher;
}

interface Queue {
  title: string;
  url: string;
}
