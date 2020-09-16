import { IApiContainer } from '../container/IApiContainer';
import { EventEmitter } from 'events';
import { ApiRequestHandler } from '../maestro/ApiRequestHandler';

export interface IApiAdapter extends EventEmitter {

	readonly name: string;
	addApiContainer(container: IApiContainer): void;
	setRequestHandler(handler: ApiRequestHandler): void;
	start(): void;

}