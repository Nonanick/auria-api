import { IAdapter } from '../adapter/IAdapter';
import { MaybePromise } from '../error/Maybe';
import { ICommand } from './ICommand';

export interface ICommandResolver {
  name: string;
  adapter: string;
  resolver: (adapter: IAdapter, command: ICommand) => MaybePromise<boolean>;
}