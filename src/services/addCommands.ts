import { EventEmitter } from 'stream';
import { ICommand } from '../interfaces/ICommand';

export function addCommands(...commands: ICommand[]): EventEmitter {
  const handlerEmitter = new EventEmitter();

  commands.forEach(({ name, func }) => {
    handlerEmitter.on(name, func);
  });

  return handlerEmitter;
}
