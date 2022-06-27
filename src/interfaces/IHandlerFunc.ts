import { Message } from 'discord.js';

export type IHandlerFunc = (
  message: Message,
  ...arg: string[]
) => void | Promise<void>;
