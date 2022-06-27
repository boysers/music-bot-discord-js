import { Message } from 'discord.js';

export const sendPing = (message: Message) => {
  message.channel.send('Pong!');
};
