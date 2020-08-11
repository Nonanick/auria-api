import path from 'path';
import { IApiController } from './IApiController';
import { IApiRoute } from '../route/IApiRoute';
import { IApiRequestProxy } from '../proxy/IApiRequestProxy';
import { IApiResponseProxy } from '../proxy/IApiResponseProxy';
import { apiRoutesSymbol } from './RegisterApiRoute';
import { ApiControllerDefaultRouteConfig } from './ApiControllerDefaultRouteConfig';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';

export abstract class ApiController implements IApiController {

  protected _apiRoutes: IApiRoute[] = [];

  /**
   * ## Default Route Configuration
   * ---------------------------
   * Changes the default configuration for all API routes
   * inside this controller
   * 
   * #### !! The configuration can be overriden by the APIRoute!!  
   * 
   * If you need to enforce a property inside all ApiRoutes override
   * *transformRoute* method
   */
  public get defaultRouteConfig():
    ApiControllerDefaultRouteConfig {
    return {};
  }

  /**
   * Request Proxies
   * ---------------
   * All Request proxies of this ApiController
   * 
   */
  protected _requestProxies: IApiRequestProxy[] = [];

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
  transformRoute(route: IApiRoute): IApiRoute {
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
  addApiRoute(route: IApiRoute) {
    let routeWithDefaults = {
      ...this.defaultRouteConfig,
      ...route
    };
    this._apiRoutes.push(routeWithDefaults);
  }

  /**
   * Request Proxies
   * ----------------
   * Return all request proxies defined for this controller
   * in the order they were added
   */
  requestProxies(): IApiRequestProxy[] {
    return [...this._requestProxies];
  }

  /**
   * Add Request Proxy
   * ------------------
   * Add a new proxy that will receive all Requests
   * that are destined to the APiResolvers which reside in this
   * controller
   * 
   * The same proxy cannot be added twice, trying to add the same proxy
   * to this controller will silently fail
   * 
   * @param proxy 
   */
  addRequestProxy(proxy: IApiRequestProxy): IApiController {
    if (!this._requestProxies.includes(proxy)) {
      this._requestProxies.push(proxy);
    }
    return this;
  }

  /**
   * Remove Request Proxy
   * ---------------------
   * Removes a previously added Request Proxy
   * Trying to remove a proxy that is not included
   * in this controller will silently fail
   * @param proxy 
   */
  removeRequestProxy(proxy: IApiRequestProxy): IApiController {
    let ioProxy = this._requestProxies.indexOf(proxy);
    if (ioProxy >= 0) {
      this._requestProxies.splice(ioProxy, 1);
    }
    return this;
  }

  /**
   * Response Proxies
   * -----------------
   * Return all Response Proxies that for this controller
   * in the order they were added
   */
  responseProxies(): IApiResponseProxy[] {
    return [...this._responseProxies];
  }

  /**
   * Add Response Proxy
   * -------------------
   * Add a new proxy that will receive the response from an APIResolver
   * which resides inside this controller
   * @param proxy 
   */
  addResponseProxy(proxy: IApiResponseProxy): IApiController {
    if (!this._responseProxies.includes(proxy)) {
      this._responseProxies.push(proxy);
    }
    return this;
  }

  /**
   * Remove Response Proxy
   * ---------------------
   * Removes a prevuisly added proxy in this controller
   * Trying to remove a proxy that is not included
   * in this controller will silently fail
   * @param proxy 
   */
  removeResponseProxy(proxy: IApiResponseProxy): IApiController {
    let ioProxy = this._responseProxies.indexOf(proxy);
    if (ioProxy >= 0) {
      this._responseProxies.splice(ioProxy, 1);
    }
    return this;
  }


  /**
   * All Routes
   * ----------
   * Return all APIRoutes with the Request and Response
   * proxys from this ApiController
   */
  allRoutes(): IProxiedApiRoute[] {
    let transformedRoutes: IProxiedApiRoute[] = this._apiRoutes
      .map(r => ({
        ...this.transformRoute(r),
        requestProxies: this.requestProxies(),
        responseProxies: this.responseProxies()
      }));

    return transformedRoutes;
  }

}