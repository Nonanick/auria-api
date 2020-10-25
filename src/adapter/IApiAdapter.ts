import { IApiContainer } from '../container/IApiContainer';
import { EventEmitter } from 'events';
import { ApiMaestro } from '../maestro/ApiMaestro';

export interface IApiAdapter extends EventEmitter {

	readonly name: string;
	addApiContainer(container: IApiContainer): void;
	setRequestHandler(handler: ApiMaestro['handle']): void;
	start(): void;

}