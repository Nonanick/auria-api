import 'reflect-metadata';
import { IAdapter, isAdapter } from '../adapter/adapter.type';
import type { IProxiedRoute } from '../proxy/proxied_route.type';
import type { IRouteRequest } from '../request/route_request.type';
import type { IRequestPipe } from './composition/request_pipe.type';
import type { RequestHandler } from './composition/request_handler.type';
import type { IMaestro } from './maestro.type';
import type { MaestroOptions, ServiceProviderAndOptions } from './maestro_options.type';
import type { SendErrorFunction } from './send_error.type';
import type { SendResponseFunction } from './send_response.type';
import * as Default from './default';
import { Container } from '../container/container.class';
import { Controller } from '../controller/controller.class';
import { Discover } from '../discover/Discover';
import { DiscoverOptions } from '../discover/DiscoverOptions';
import { RequestFlowNotDefined } from '../error/exceptions/request_flow_not_defined';
import { ValidateRequest } from './default/validate_request.fn';
import { SchemaEnforcer } from '../route/schema/schema_enforcer.fn';
import { container, DependencyContainer, InjectionToken, Lifecycle } from 'tsyringe';
import { IServiceProvider, isServiceProvider } from '../service/service_provider.type';
import type { Class } from 'type-fest';
import { isConstructor } from '../util/is_constructor.fn';

export class Maestro extends Container implements IMaestro {

	static RegisteredServices : {
		[name in string | symbol] : ServiceProviderAndOptions;
	} = {};

	get baseURL() {
		return '';
	}

	#container: DependencyContainer = container;

	#resolveAtBoot: (Class<Container> | Class<Controller> | Class<IAdapter> | Class<IServiceProvider>)[] = [];

	public adapters: {
		[name: string]: IAdapter;
	} = {};

	private resolveStartPromise: (() => void) | undefined;

	private _started: Promise<void>;

	private _services: Map<InjectionToken, ServiceProviderAndOptions> = new Map();

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
		Default.MaestroRequestHandler;

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

		if(options?.container != null) {
			this.#container = options.container;
		}

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

		if (options?.services != null) {
			Object.entries(options.services).forEach(
				([token, provider]) => {
					this.addService(token, provider);
				}
			);
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

			if (isAdapter(use)) {
				this.addAdapter(use);
			}

			if (isServiceProvider(use)) {
				use.services().forEach(([token, service]) => {
					this.addService(token, service);
				});
			}

			if (isConstructor(use)) {
				this.#resolveAtBoot.push(use);
			}

		});
	}

	setService(token: InjectionToken, service: ServiceProviderAndOptions) {
		this.#container.register(token, service as any);
		this._services.set(token, service);
	}

	hasService(token: InjectionToken) {
		return this._services.has(token);
	}

	addService(token: InjectionToken, service: ServiceProviderAndOptions): void {
		this.setService(token, service);
	}

	removeService(token: InjectionToken) {
		this._services.delete(token);
		this.#container.reset();

		for (let [token, service] of this._services.entries()) {
			this.setService(token, service);
		}
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

	public handle: IMaestroRequestHandler = async (
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

		// Boot services
		for (let [token, provider] of this._services.entries()) {
			this.setService(token, provider);
		}

		// Boot pending resolutions
		for (let pendingConstructor of this.#resolveAtBoot) {
			this.#container.register(pendingConstructor.name as any, pendingConstructor as any);
			let instance = this.#container.resolve(pendingConstructor.name);
			this.use(instance as UseInMaestro);
		}

		// Boot adapters
		for (let adapterName in this.adapters) {
			let adapter = this.adapters[adapterName];
			adapter.setRequestHandler(this.handle);
			adapter.addContainer(this);
			adapter.start();
		}

		this.resolveStartPromise!();
		this.resolveStartPromise = undefined;
	}

	getDependencyManager() {
		return this.#container;
	}

	makeDiscoverable(options?: Partial<DiscoverOptions>) {
		this.addChildContainer(new Discover(this, options));
	}

}


export type UseInMaestro =
	| Container | Controller | IAdapter | IServiceProvider
	| Class<Container> | Class<Controller> | Class<IAdapter> | Class<IServiceProvider>;

export type IMaestroRequestHandler = (
	route: IProxiedRoute,
	request: IRouteRequest,
	sendResponse: SendResponseFunction,
	sendError: SendErrorFunction
) => Promise<void>;