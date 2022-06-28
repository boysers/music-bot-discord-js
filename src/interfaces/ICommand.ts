import { IHandlerFunc } from './IHandlerFunc';

export interface ICommand {
  name: string;
  func: IHandlerFunc;
}
