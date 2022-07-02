import { Client } from 'discord.js';
import { EventEmitter } from 'stream';

export class Bot {
  private bot: Client;

  constructor(private commands: EventEmitter, private PREFIX = '!') {
    this.bot = new Client();
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
      if (message.author.bot) return;

      const args = message.content.substring(this.PREFIX.length).split(' ');

      this.commands.emit(args[0], message, args[1]);
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
