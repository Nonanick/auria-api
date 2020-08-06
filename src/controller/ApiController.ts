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
   * 
   */
  protected _requestProxies: IApiRequestProxy[] = [];

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
   * ----------------
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
   * Remember to call *super.transformRoute* if you wish to preserve the default behaviour!
   * 
   * @param route Route that will be transformed
   */
  transformRoute(route: IApiRoute): IApiRoute {
    let transformedRoute = { ...route };
    transformedRoute.url = path.join(this.baseURL, route.url);
    return transformedRoute;
  }

  /**
   * 
   * @param route 
   */
  addApiRoute(route: IApiRoute) {
    let routeWithDefaults = {
      ...this.defaultRouteConfig,
      ...route
    };
    this._apiRoutes.push(routeWithDefaults);
  }

  requestProxies(): IApiRequestProxy[] {
    return [...this._requestProxies];
  }

  addRequestProxy(proxy: IApiRequestProxy): IApiController {
    if (!this._requestProxies.includes(proxy)) {
      this._requestProxies.push(proxy);
    }
    return this;
  }

  removeRequestProxy(proxy: IApiRequestProxy): IApiController {
    let ioProxy = this._requestProxies.indexOf(proxy);
    if (ioProxy >= 0) {
      this._requestProxies.splice(ioProxy, 1);
    }
    return this;
  }

  responseProxies(): IApiResponseProxy[] {
    return [...this._responseProxies];
  }

  addResponseProxy(proxy: IApiResponseProxy): IApiController {
    if (!this._responseProxies.includes(proxy)) {
      this._responseProxies.push(proxy);
    }
    return this;
  }

  removeResponseProxy(proxy: IApiResponseProxy): IApiController {
    let ioProxy = this._responseProxies.indexOf(proxy);
    if (ioProxy >= 0) {
      this._responseProxies.splice(ioProxy, 1);
    }
    return this;
  }

  allRoutes(): IProxiedApiRoute[] {
    let transformedRoutes: IProxiedApiRoute[] = this._apiRoutes
      .map(r => ({
        ...this.transformRoute(r),
        requestProxies: this.requestProxies(),
        responseProxies: this.responseProxies()
      }));

    return transformedRoutes;
  }

  runResolver() {

  }

}