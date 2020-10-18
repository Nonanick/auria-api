import path from 'path';
import { ApiAdapterClass, IApiContainer } from './IApiContainer';
import { IApiController } from '../controller/IApiController';
import { IApiRequestProxy } from '../proxy/IApiRequestProxy';
import { IApiResponseProxy } from '../proxy/IApiResponseProxy';
import { EventEmitter } from 'events';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';
import { IApiAdapter } from '../adapter/IApiAdapter';

export abstract class ApiContainer extends EventEmitter implements IApiContainer {

	abstract get baseURL(): string;

	protected _targetedAdapters?: ApiAdapterClass[];

	protected _cachedRoutes?: IProxiedApiRoute[];

	transformRoute(route: IProxiedApiRoute): IProxiedApiRoute {

		let nRoute: IProxiedApiRoute = {
			...route,
			url: path.posix.join(this.baseURL, route.url),
			requestProxies: [...this.requestProxies(), ...route.requestProxies],
			responseProxies: [...this.responseProxies(), ...route.responseProxies]
		};

		return nRoute;
	}

	/**
	 * Controllers
	 * -----------
	 */
	protected _controllers: IApiController[] = [];

	controllers(): IApiController[] {
		return [...this._controllers];
	}

	addController(...controllers: IApiController[]): IApiContainer {
		for (let controller of controllers) {
			if (!this._controllers.includes(controller)) {
				this._controllers.push(controller);
			}
		}
		return this;
	}

	removeController(controller: IApiController): IApiContainer {
		let ioController = this._controllers.indexOf(controller);
		if (ioController >= 0) {
			this._controllers.splice(ioController, 1);
		}
		return this;
	}

	protected _containers: IApiContainer[] = [];

	containers(): IApiContainer[] {
		return [...this._containers];
	}

	addChildContainer(...containers: IApiContainer[]): IApiContainer {
		for (let container of containers) {
			if (!this._containers.includes(container)) {
				this._containers.push(container);
			}
		}
		return this;
	}

	removeChildContainer(container: IApiContainer): IApiContainer {
		let ioContainer = this._containers.indexOf(container);
		if (ioContainer >= 0) {
			this._containers.splice(ioContainer, 1);
		}
		return this;
	}

	protected _requestProxies: IApiRequestProxy[] = [];

	requestProxies(): IApiRequestProxy[] {
		return [...this._requestProxies];
	}

	addRequestProxy(...proxies: IApiRequestProxy[]): IApiContainer {
		for (let proxy of proxies) {
			if (!this._requestProxies.includes(proxy)) {
				this._requestProxies.push(proxy);
			}
		}
		return this;
	}

	removeRequestProxy(...proxies: IApiRequestProxy[]): IApiContainer {
		for (let proxy of proxies) {
			let ioProxy = this._requestProxies.indexOf(proxy);
			if (ioProxy >= 0) {
				this._requestProxies.splice(ioProxy, 1);
			}
		}
		return this;
	}

	protected _responseProxies: IApiResponseProxy[] = [];

	responseProxies(): IApiResponseProxy[] {
		return [...this._responseProxies];
	}

	addResponseProxy(...proxies: IApiResponseProxy[]): IApiContainer {
		for (let proxy of proxies) {
			if (!this._responseProxies.includes(proxy)) {
				this._responseProxies.push(proxy);
			}
		}
		return this;
	}

	removeResponseProxy(...proxies: IApiResponseProxy[]): IApiContainer {
		for (let proxy of proxies) {
			let ioProxy = this._responseProxies.indexOf(proxy);
			if (ioProxy >= 0) {
				this._responseProxies.splice(ioProxy, 1);
			}
		}
		return this;
	}

	allRoutes(): IProxiedApiRoute[] {

		if (this._cachedRoutes != null) {
			return this._cachedRoutes;
		}

		let childContainerRoutes = this._containers.map(c => c.allRoutes());
		let controllerRoutes = this._controllers.map(c => c.allRoutes());

		let allRoutes: IProxiedApiRoute[] = [];

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
				if (c instanceof ApiContainer)
					c.deleteCachedRoutes();
			}
		);
		delete this._cachedRoutes;
	}

	setTargetedAdapters(adapters: ApiAdapterClass[]) {
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

	acceptsAdapter(adapterInstance: IApiAdapter): boolean {
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

