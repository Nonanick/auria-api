import { Controller } from '../controller/Controller';
import { IAdapter } from '../adapter/IAdapter';
import { Container } from '../container/Container';
import { ApiError } from '../error/ApiError';
import { ApiException } from '../error/ApiException';
import { RequestFlowNotDefined } from '../error/exceptions/RequestFlowNotDefined';
import { IProxiedRoute } from '../proxy/IProxiedRoute';
import { IRouteRequest } from '../request/IRouteRequest';
import { SendErrorFunction } from './SendErrorFunction';
import { SendResponseFunction } from './SendResponseFunction';
import { RequestHandler } from './composition/RequestHandler';
import { IRequestPipe } from './composition/RequestPipe';
import * as Default from './default';
import { IMaestro } from './IMaestro';

export class Maestro extends Container implements IMaestro {

	get baseURL() {
		return '';
	}

	public adapters: {
		[name: string]: IAdapter;
	} = {};

	protected requestPipes: IRequestPipe[] = [
		{
			name: 'property-validator',
			pipe: Default.SchemaValidator
		},
		{
			name: 'schema-enforcer',
			pipe: Default.SchemaEnforcer
		},
		{
			name: 'request-caster',
			pipe: Default.CastProperties
		}
	];


	public requestHandler: RequestHandler =
		Default.RequestHandler;

	/**
	 * Api Maestro
	 * -----------
	 * 
	 * Mostly responsible for wiring all the elements of the library
	 * Will connect all the adapters to the exposed API Endpoints
	 * enforcing policies and request/response flow inside the app
	 * 
	 */
	constructor() {
		super();
	}

	setRequestHandler(resolver: RequestHandler): void {
		this.requestHandler = resolver;
	}

	addAdapter(adapter: IAdapter) {
		this.adapters[adapter.name] = adapter;
	}

	use(...addToLyra: UseInMaestro[]) {
		addToLyra.forEach(use => {
			if (use instanceof Container) {
				this.addChildContainer(use);
				return;
			}

			if (use instanceof Controller) {
				this.addController(use);
				return;
			}

		});
	}

	pipe(...pipes: IRequestPipe[]) {
		this.requestPipes = [...this.requestPipes, ...pipes];
		return this;
	}

	removePipe(name: string): boolean {
		let filteredPipes = this.requestPipes.filter(p => p.name !== name);
		let foundMatches = this.requestPipes.length !== filteredPipes.length;
		this.requestPipes = filteredPipes;
		return foundMatches;
	}

	allPipeNames(): string[] {
		return this.requestPipes.map(p => p.name);
	}

	allPipes() {
		return [...this.requestPipes];
	}

	public handle = async (
		route: IProxiedRoute,
		request: IRouteRequest,
		sendResponse: SendResponseFunction,
		sendError: SendErrorFunction
	) => {

		for (let pipe of this.requestPipes) {
			let canProceed = await pipe.pipe(route, request);
			if (canProceed !== true) {
				console.error('Failed to fulfill request!\n', pipe.name, ' returned the error: ', canProceed.message);
				sendError(canProceed);
				return;
			}
		}

		// Call API Endpoint
		let apiResponse = await this.requestHandler(route, request, sendResponse, sendError);
		if (apiResponse instanceof Error) {
			sendError(apiResponse);
			return;
		}

		// Any commands for Maestro ? 
		// TODO -- what will be exposed to ApiMaestro Command?

		sendResponse(apiResponse);
	};

	start() {

		if (typeof this.requestHandler !== "function") {
			throw new RequestFlowNotDefined(
				'API Maestro cannot fullfil request flow, one of its required pieces is missing! -> Request Resolver'
			);
		}

		for (let adapterName in this.adapters) {
			let adapter = this.adapters[adapterName];
			adapter.setRequestHandler(this.handle);
			adapter.addContainer(this);
			adapter.start();
		}

	}

}


export type UseInMaestro = Container | Controller;