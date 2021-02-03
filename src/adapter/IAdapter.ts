import { IContainer } from '../container/IContainer';
import { EventEmitter } from 'events';
import { Maestro, MaestroRequestHandler } from '../maestro/Maestro';

export interface IAdapter extends EventEmitter {

	readonly name: string;
	addContainer(container: IContainer): void;
	setRequestHandler(handler: MaestroRequestHandler): void;
	start(): void;

}