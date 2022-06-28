import { Message } from 'discord.js';

export type IHandlerFunc = (
  message: Message,
  ...args: any[]
) => void | Promise<void>;
