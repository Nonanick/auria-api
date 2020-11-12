import { EventEmitter } from 'events';
import { IAdapter } from '../adapter/IAdapter';
import { IController } from '../controller/IController';
import { IProxyRequest } from '../proxy/IProxyRequest';
import { IApiResponseProxy } from '../proxy/IProxyResponse';
import { IProxiedRoute } from '../proxy/IProxiedRoute';

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

	responseProxies(): IApiResponseProxy[];
	addResponseProxy(proxy: IApiResponseProxy): IContainer;
	removeResponseProxy(proxy: IApiResponseProxy): IContainer;

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

}

/**
 * ApiAdapterClass
 * ----------------
 * 
 * Class type that implements IApiAdapter
 */
export type AdapterClass = new (...args: any[]) => IAdapter & IAdapter;