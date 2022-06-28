import { Player } from './controllers/music';
import { sendPing } from './controllers/test';
import { addCommands } from './services/addCommands';

const commands = addCommands();

// === Commande de testes ===
commands.on('ping', sendPing);

// === Commande du player ===
const musicPlayer = new Player();

commands.on('play', musicPlayer.play);
commands.on('skip', musicPlayer.skip);
commands.on('stop', musicPlayer.stop);
commands.on('list', musicPlayer.list);
commands.on('help', musicPlayer.help);

export default commands;
