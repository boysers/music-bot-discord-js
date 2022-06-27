import { Bot } from './bot';
import dotenv from 'dotenv';
import { sendPing } from './controllers/test';
import { Player } from './controllers/music';
dotenv.config();

const { TOKEN, CHANNEL_ID } = process.env;

export const channelId = CHANNEL_ID;

const bot = new Bot();
const musicPlayer = new Player();

// === Commande de testes ===
bot.addCommand('ping', sendPing);

// === Commande du player ===
bot.addCommand('play', musicPlayer.play);
bot.addCommand('skip', musicPlayer.skip);
bot.addCommand('stop', musicPlayer.stop);
bot.addCommand('list', musicPlayer.list);
bot.addCommand('help', musicPlayer.help);

bot.start(TOKEN);
