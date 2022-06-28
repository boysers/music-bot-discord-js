import { Bot } from './bot';
import dotenv from 'dotenv';
import commands from './commands';
dotenv.config();

const { TOKEN, CHANNEL_ID } = process.env;

export const channelId = CHANNEL_ID;

const bot = new Bot(commands);

bot.start(TOKEN);
