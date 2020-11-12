import { IContainer } from '../container/IContainer';
import { EventEmitter } from 'events';
import { Maestro } from '../maestro/Maestro';

export interface IAdapter extends EventEmitter {

	readonly name: string;
	addContainer(container: IContainer): void;
	setRequestHandler(handler: Maestro['handle']): void;
	start(): void;

}