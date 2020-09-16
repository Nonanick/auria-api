import { EventEmitter } from 'events';
import { IApiAdapter } from '../adapter/IApiAdapter';
import { IApiController } from '../controller/IApiController';
import { IApiRequestProxy } from '../proxy/IApiRequestProxy';
import { IApiResponseProxy } from '../proxy/IApiResponseProxy';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';

export interface IApiContainer extends EventEmitter {

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
	controllers(): IApiController[];
	addController(controller: IApiController): IApiContainer;
	removeController(controller: IApiController): IApiContainer;

	containers(): IApiContainer[];
	addChildContainer(container: IApiContainer): IApiContainer;
	removeChildContainer(container: IApiContainer): IApiContainer;

	requestProxies(): IApiRequestProxy[];
	addRequestProxy(proxy: IApiRequestProxy): IApiContainer;
	removeRequestProxy(proxy: IApiRequestProxy): IApiContainer;

	responseProxies(): IApiResponseProxy[];
	addResponseProxy(proxy: IApiResponseProxy): IApiContainer;
	removeResponseProxy(proxy: IApiResponseProxy): IApiContainer;

	/**
	 * Set Targeted Adapters
	 * ----------------------
	 * Define which adapters this Container can handle
	 */
	setTargetedAdapters(adapters: ApiAdapterClass[]): void;
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
	acceptsAdapter(adapterInstance: IApiAdapter): boolean;

	allRoutes(): IProxiedApiRoute[];

}

/**
 * ApiAdapterClass
 * ----------------
 * 
 * Class type that implements IApiAdapter
 */
export type ApiAdapterClass = new (...args: any[]) => IApiAdapter & IApiAdapter;