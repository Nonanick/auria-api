import type { IAdapter } from '../adapter/IAdapter';
import type { IProxiedRoute } from '../proxy/IProxiedRoute';
import type { IRouteRequest } from '../request/IRouteRequest';
import type { IRequestPipe } from './composition/RequestPipe';
import type { RequestHandler } from './composition/RequestHandler';
import type { IMaestro } from './IMaestro';
import type { MaestroOptions } from './MaestroOptions';
import type { SendErrorFunction } from './SendErrorFunction';
import type { SendResponseFunction } from './SendResponseFunction';
import * as Default from './default';
import { Container } from '../container/Container';
import { Controller } from '../controller/Controller';
import { Discover } from '../discover/Discover';
import { DiscoverOptions } from '../discover/DiscoverOptions';
import { RequestFlowNotDefined } from '../error/exceptions/RequestFlowNotDefined';
import { ValidateRequest } from './default/ValidateRequest';
import { SchemaEnforcer } from '../route/schema/SchemaEnforcer';

export class Maestro extends Container implements IMaestro {

	get baseURL() {
		return '';
	}

	public adapters: {
		[name: string]: IAdapter;
	} = {};

	private resolveStartPromise: (() => void) | undefined;

	private _started: Promise<void>;

	get started() {
		return this._started;
	}
	protected requestPipes: IRequestPipe[] = [
		{
			name: 'schema-enforcer',
			pipe: SchemaEnforcer
		},
		{
			name: 'request-validator',
			pipe: ValidateRequest
		},
		{
			name: 'request-caster',
			pipe: Default.CastProperties
		}
	];

	/**
	 * Request Handler
	 * ---------------
	 * 
	 * Function responsible to proccess the incoming request
	 * 
	 */
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
	constructor(options?: Partial<MaestroOptions>) {
		super();

		this._started = new Promise<void>((resolve) => {
			this.resolveStartPromise = resolve;
		});

		if (options?.adapters != null) {
			options.adapters.forEach(adapter => {
				this.addAdapter(adapter);
			});
		}

		if (options?.useRoutesFrom != null) {
			this.use(...options.useRoutesFrom);
		}

		if (options?.requestPipes != null) {
			this.pipe(...options.requestPipes);
		}
	}

	setRequestHandler(handler: RequestHandler): void {
		this.requestHandler = handler;
	}

	addAdapter(adapter: IAdapter) {
		this.adapters[adapter.name] = adapter;
	}

	use(...addToMaestro: UseInMaestro[]) {
		addToMaestro.forEach(use => {
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

	add(...addToMaestro: UseInMaestro[]) {
		this.use(...addToMaestro);
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

	public handle: MaestroRequestHandler = async (
		route: IProxiedRoute,
		request: IRouteRequest,
		sendResponse: SendResponseFunction,
		sendError: SendErrorFunction
	) => {

		for (let pipe of this.requestPipes) {
			let canProceed = await pipe.pipe(route, request);
			if (canProceed !== true) {
				console.error('Failed to fulfill request! "' + pipe.name + '" returned the error: ', canProceed.message);
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


	hasStarted(): boolean {
		return this.resolveStartPromise == null;
	}

	start() {

		if (this.resolveStartPromise == null) return;

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

		this.resolveStartPromise!();
		this.resolveStartPromise = undefined;
	}

	makeDiscoverable(options?: Partial<DiscoverOptions>) {
		this.addChildContainer(new Discover(this, options));
	}

}


export type UseInMaestro = Container | Controller;

export type MaestroRequestHandler = (
	route: IProxiedRoute,
	request: IRouteRequest,
	sendResponse: SendResponseFunction,
	sendError: SendErrorFunction
) => Promise<void>;