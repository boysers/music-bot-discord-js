import { StreamDispatcher } from 'discord.js';

export interface IServer {
  id: string;
  dispatcher: StreamDispatcher;
  queues: Queue[];
}

interface Queue {
  title: string;
  url: string;
}
