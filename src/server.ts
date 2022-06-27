import { Bot } from './bot';
import dotenv from 'dotenv';
import { sendPing } from './controllers/test';
import { Player } from './controllers/music';
dotenv.config();

const { TOKEN, CHANNEL_ID } = process.env;

export const channelId = CHANNEL_ID;

const bot = new Bot();
const playerMusic = new Player();

bot.addCommand('ping', sendPing);

bot.addCommand('play', playerMusic.play);
bot.addCommand('skip', playerMusic.skip);
bot.addCommand('stop', playerMusic.stop);
bot.addCommand('list', playerMusic.list);
bot.addCommand('help', playerMusic.help);

bot.start(TOKEN);
