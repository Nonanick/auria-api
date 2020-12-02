import path from 'path';
import type { IProxiedRoute } from '../proxy/IProxiedRoute';
import type { IProxyRequest } from '../proxy/IProxyRequest';
import type { IApiResponseProxy } from '../proxy/IProxyResponse';
import type { IRoute } from '../route/IRoute';
import type { IController } from './IController';
import { apiRoutesSymbol } from './RouteDecorator';

export abstract class Controller implements IController {

	protected _apiRoutes: IRoute[] = [];

	/**
	 * Request Proxies
	 * ---------------
	 * All Request proxies of this ApiController
	 * 
	 */
	protected _requestProxies: IProxyRequest[] = [];

	/**
	 * Response Proxies
	 * ----------------
	 * All Response proxies of this ApiController
	 */
	protected _responseProxies: IApiResponseProxy[] = [];

	abstract get baseURL(): string;

	constructor() {

		// Fetch from class prototype
		let proto = Object.getPrototypeOf(this);

		if (proto[apiRoutesSymbol] == null) {
			proto[apiRoutesSymbol] = [];
		}

		this._apiRoutes = [...proto[apiRoutesSymbol]];

	}
	defaultRouteConfig: any;

	/**
	 * ## Transform Route
	 * ------------------
	 * 
	 * Act as a proxy for all APIRoutes inside this controller
	 * 
	 * By default it only appends the base URL of the controller to all 
	 * routes inside of it  
	 * You can override this method to disable this behaviour !
	 * 
	 * If you need to enforce a property too all APIRoutes
	 * defined inside this controller the best way to achieve it
	 * is to override this method! 
	 * 
	 * Remember to call *super.transformRoute* if you wish to preserve 
	 * the default behaviour!
	 * 
	 * @param route Route that will be transformed
	 */
	transformRoute(route: IRoute): IRoute {
		let transformedRoute = { ...route };
		transformedRoute.url = path.posix.join(this.baseURL, route.url);
		return transformedRoute;
	}

	/**
	 * Add API Route
	 * --------------
	 * 
	 * Add a new APIRoute to this instance of APIController
	 * opposite to '@RegisterApiRoute' decorator which defined a new
	 * API Route to ALL instances of the same class
	 * @param route 
	 */
	addApiRoute(route: IRoute) {
		let routeWithDefaults = {
			...this.defaultRouteConfig,
			...route
		};
		this._apiRoutes.push(routeWithDefaults);
	}

	requestProxies(): IProxyRequest[] {
		return [...this._requestProxies];
	}

	addRequestProxy(...proxies: IProxyRequest[]): IController {
		for (let proxy of proxies) {
			if (!this._requestProxies.includes(proxy)) {
				this._requestProxies.push(proxy);
			}
		}
		return this;
	}

	removeRequestProxy(proxy: IProxyRequest): IController {
		let ioProxy = this._requestProxies.indexOf(proxy);
		if (ioProxy >= 0) {
			this._requestProxies.splice(ioProxy, 1);
		}
		return this;
	}

	responseProxies(): IApiResponseProxy[] {
		return [...this._responseProxies];
	}

	addResponseProxy(...proxies: IApiResponseProxy[]): IController {
		for (let proxy of proxies) {
			if (!this._responseProxies.includes(proxy)) {
				this._responseProxies.push(proxy);
			}
		}
		return this;
	}

	removeResponseProxy(proxy: IApiResponseProxy): IController {
		let ioProxy = this._responseProxies.indexOf(proxy);
		if (ioProxy >= 0) {
			this._responseProxies.splice(ioProxy, 1);
		}
		return this;
	}

	allRoutes(): IProxiedRoute[] {
		let transformedRoutes: IProxiedRoute[] = this._apiRoutes
			.map(r => ({
				...this.transformRoute(r),
				requestProxies: this.requestProxies(),
				responseProxies: this.responseProxies(),
				controller: this,
			}));

		return transformedRoutes;
	}

}