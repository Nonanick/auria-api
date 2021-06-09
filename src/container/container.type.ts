import type { EventEmitter } from 'events';
import type { IAdapter } from '../adapter/adapter.type';
import type { IController } from '../controller/controller.type';
import type { IProxyRequest } from '../proxy/proxy_request.type';
import type { IProxyResponse } from '../proxy/proxy_response.type';
import type { IProxiedRoute } from '../proxy/proxied_route.type';
import { IService } from '../service/service.type';
import { Class } from 'type-fest';

export interface IContainer extends EventEmitter {

	/**
	 * Base URL
	 * --------
	 * When assigning this container to an adapter place all of its children inside
	 * a "path" that will enter the URI of the route
	 * Empty base url's mean that no path shall be created 
	 */
	readonly baseURL: string;

	/**
	 * Controllers
	 * ------------
	 * All the child controllers that reside inside this container
	 * 
	 * @param controller 
	 */
	controllers(): IController[];
	addController(controller: IController): IContainer;
	removeController(controller: IController): IContainer;

	containers(): IContainer[];
	addChildContainer(container: IContainer): IContainer;
	removeChildContainer(container: IContainer): IContainer;

	requestProxies(): IProxyRequest[];
	addRequestProxy(proxy: IProxyRequest): IContainer;
	removeRequestProxy(proxy: IProxyRequest): IContainer;

	responseProxies(): IProxyResponse[];
	addResponseProxy(proxy: IProxyResponse): IContainer;
	removeResponseProxy(proxy: IProxyResponse): IContainer;

	/**
	 * Set Targeted Adapters
	 * ----------------------
	 * Define which adapters this Container can handle
	 */
	setTargetedAdapters(adapters: AdapterClass[]): void;
	/**
	 * Remove Targeted Adapters
	 * -------------------------
	 * Erase the constraint of acceptable adapters of this Container
	 */
	removeTargetedAdapters(): void;
	/**
	 * Has Targeted Adapters
	 * ---------------------
	 * Check if there is a constraint for targeted adapters
	 */
	hasTargetedAdapters(): boolean;
	/**
	 * Accepts Adapter
	 * ---------------
	 * Given an ApiAdapter check it it's accepted by this container
	 * If no constraint is defined, by default, a Container accepts
	 * all adapters
	 * 
	 * @param adapterInstance Object that implements IApiAdapter
	 */
	acceptsAdapter(adapterInstance: IAdapter): boolean;

	allRoutes(): IProxiedRoute[];

	allServices() : {
		[name in string | symbol] : Class<IService>;
	};

}

/**
 * ApiAdapterClass
 * ----------------
 * 
 * Class type that implements IApiAdapter
 */
export type AdapterClass = new (...args: any[]) => IAdapter & IAdapter;