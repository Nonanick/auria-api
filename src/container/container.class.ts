import path from 'path';
import type { AdapterClass, IContainer } from './container.type';
import type { IController } from '../controller/controller.type';
import type { IProxyRequest } from '../proxy/proxy_request.type';
import type { IProxyResponse } from '../proxy/proxy_response.type';
import { EventEmitter } from 'events';
import type { IProxiedRoute } from '../proxy/proxied_route.type';
import type { IAdapter } from '../adapter/adapter.type';
import type { ContainerOptions } from './container_options.type';
import type { InjectionToken } from 'tsyringe';
import type { ServiceProviderAndOptions } from '../maestro/maestro_options.type';

export abstract class Container extends EventEmitter implements IContainer {

	abstract get baseURL(): string;

	protected _targetedAdapters?: AdapterClass[];

	protected _cachedRoutes?: IProxiedRoute[];

	/**
	 * Controllers
	 * -----------
	 */
	protected _controllers: IController[] = [];

	#services: {
		[token in string | symbol]: ServiceProviderAndOptions;
	} = {};

	protected _dependencies: {
		[name in string | symbol]: any;
	} = {};

	constructor(options?: Partial<ContainerOptions>) {
		super();
		this.#services = options?.services ?? {};
		this._controllers = options?.controllers ?? [];
		this._containers = options?.containers ?? [];
	}

	services(): ([InjectionToken, ServiceProviderAndOptions])[] {
		return Object.entries(this.#services)
			.map(([token, service]) => {
				return [token, service];
			});
	}

	transformRoute(route: IProxiedRoute): IProxiedRoute {

		let nRoute: IProxiedRoute = {
			...route,
			requestProxies: [...this.requestProxies(), ...route.requestProxies],
			responseProxies: [...this.responseProxies(), ...route.responseProxies]
		};

		if (this.baseURL !== '') nRoute.url = path.posix.join(this.baseURL, route.url);

		return nRoute;
	}

	controllers(): IController[] {
		return [...this._controllers];
	}

	addController(...controllers: IController[]): IContainer {
		for (let controller of controllers) {
			if (!this._controllers.includes(controller)) {
				this._controllers.push(controller);
			}
		}
		return this;
	}

	removeController(controller: IController): IContainer {
		let ioController = this._controllers.indexOf(controller);
		if (ioController >= 0) {
			this._controllers.splice(ioController, 1);
		}
		return this;
	}

	protected _containers: IContainer[] = [];

	containers(): IContainer[] {
		return [...this._containers];
	}

	addChildContainer(...containers: IContainer[]): IContainer {
		for (let container of containers) {
			if (!this._containers.includes(container)) {
				this._containers.push(container);
			}
		}
		return this;
	}

	removeChildContainer(container: IContainer): IContainer {
		let ioContainer = this._containers.indexOf(container);
		if (ioContainer >= 0) {
			this._containers.splice(ioContainer, 1);
		}
		return this;
	}

	protected _requestProxies: IProxyRequest[] = [];

	requestProxies(): IProxyRequest[] {
		return [...this._requestProxies];
	}

	addRequestProxy(...proxies: IProxyRequest[]): IContainer {
		for (let proxy of proxies) {
			if (!this._requestProxies.includes(proxy)) {
				this._requestProxies.push(proxy);
			}
		}
		return this;
	}

	removeRequestProxy(...proxies: IProxyRequest[]): IContainer {
		for (let proxy of proxies) {
			let ioProxy = this._requestProxies.indexOf(proxy);
			if (ioProxy >= 0) {
				this._requestProxies.splice(ioProxy, 1);
			}
		}
		return this;
	}

	protected _responseProxies: IProxyResponse[] = [];

	responseProxies(): IProxyResponse[] {
		return [...this._responseProxies];
	}

	addResponseProxy(...proxies: IProxyResponse[]): IContainer {
		for (let proxy of proxies) {
			if (!this._responseProxies.includes(proxy)) {
				this._responseProxies.push(proxy);
			}
		}
		return this;
	}

	removeResponseProxy(...proxies: IProxyResponse[]): IContainer {
		for (let proxy of proxies) {
			let ioProxy = this._responseProxies.indexOf(proxy);
			if (ioProxy >= 0) {
				this._responseProxies.splice(ioProxy, 1);
			}
		}
		return this;
	}

	allRoutes(): IProxiedRoute[] {

		if (this._cachedRoutes != null) {
			return this._cachedRoutes;
		}

		let childContainerRoutes = this._containers.map(c => c.allRoutes());
		let controllerRoutes = this._controllers.map(c => c.allRoutes());

		let allRoutes: IProxiedRoute[] = [];

		allRoutes = allRoutes.concat(...controllerRoutes);
		allRoutes = allRoutes.concat(...childContainerRoutes);

		this._cachedRoutes = allRoutes.map(r => {
			return { ...this.transformRoute(r) };
		});

		// Add Base URL to route URL's
		return [...this._cachedRoutes];
	}

	deleteCachedRoutes() {
		this.containers().forEach(
			(c) => {
				if (c instanceof Container)
					c.deleteCachedRoutes();
			}
		);
		delete this._cachedRoutes;
	}

	allServices() {
		return { ...this.#services };
	}
	setTargetedAdapters(adapters: AdapterClass[]) {
		this._targetedAdapters = adapters;
	}

	removeTargetedAdapters() {
		delete this._targetedAdapters;
	}

	hasTargetedAdapters(): boolean {
		return this._targetedAdapters != null
			? this._targetedAdapters.length > 0
			: false;
	}

	acceptsAdapter(adapterInstance: IAdapter): boolean {
		if (this.hasTargetedAdapters()) {
			for (let c of this._targetedAdapters ?? []) {
				if (adapterInstance instanceof c) {
					return true;
				}
			}
			return false;
		}
		return true;
	}
}

