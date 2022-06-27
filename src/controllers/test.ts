import { Message } from 'discord.js';

export const sendPing = (message: Message): void => {
  message.channel.send('Pong!');
};
