import path from 'path';
import { AdapterClass, IContainer } from './container.type';
import { IController } from '../controller/controller.type';
import { IProxyRequest } from '../proxy/proxy_request.type';
import { IProxyResponse } from '../proxy/proxy_response.type';
import { EventEmitter } from 'events';
import { IProxiedRoute } from '../proxy/proxied_route.type';
import { IAdapter } from '../adapter/adapter.type';
import { ContainerOptions } from './container_options.type';
import { IService } from '../service/service.type';
import { Class } from 'type-fest';

export abstract class Container extends EventEmitter implements IContainer {

	abstract get baseURL(): string;

	protected _targetedAdapters?: AdapterClass[];

	protected _cachedRoutes?: IProxiedRoute[];


	/**
	 * Controllers
	 * -----------
	 */
	protected _controllers: IController[] = [];

	#services : {
		[name in string | symbol] : Class<IService>;
	} = {};

	protected _dependencies : {
		[name in string | symbol] : any;
	} = {};

	constructor(options? : Partial<ContainerOptions>) {
		super();


	}
	
	transformRoute(route: IProxiedRoute): IProxiedRoute {

		let nRoute: IProxiedRoute = {
			...route,
			requestProxies: [...this.requestProxies(), ...route.requestProxies],
			responseProxies: [...this.responseProxies(), ...route.responseProxies]
		};

		if(this.baseURL !== '') nRoute.url = path.posix.join(this.baseURL, route.url);

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
		return {...this.#services};
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

