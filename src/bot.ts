import { Client } from 'discord.js';
import { EventEmitter } from 'stream';
import { IHandlerFunc } from './interfaces/IHandlerFunc';
import { channelId } from './server';

export class Bot {
  private bot: Client;
  private handler: EventEmitter;

  constructor(private PREFIX = '!') {
    this.bot = new Client();
    this.handler = new EventEmitter();
  }

  public addCommand(commandName: string, handlerFunc: IHandlerFunc) {
    this.handler.on(commandName, handlerFunc);
  }

  private onceReady() {
    this.bot.once('ready', () => {
      console.log(`Logged in as ${this.bot.user.tag}!`);

      this.bot.user.setPresence({
        activity: { name: this.PREFIX + 'play', type: 'LISTENING' },
        status: 'idle'
      });
    });
  }

  private onMessage() {
    this.bot.on('message', (message) => {
      if (message.channel.id !== channelId) return;

      const args = message.content.substring(this.PREFIX.length).split(' ');

      this.handler.emit(args[0], message, args[1]);
    });
  }

  private setEvent() {
    this.onceReady();
    this.onMessage();
  }

  public start(token: string) {
    this.setEvent();

    this.bot.login(token);
  }
}
