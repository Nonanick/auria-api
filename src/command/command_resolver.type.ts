import { IAdapter } from '../adapter/adapter.type';
import { MaybePromise } from '../error/maybe.type';
import { ICommand } from './command.type';

export interface ICommandResolver {
  name: string;
  adapter: string;
  resolver: (adapter: IAdapter, command: ICommand) => MaybePromise<boolean>;
}