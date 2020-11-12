import { IRoute } from '../route/IRoute';
import { IProxyRequest } from '../proxy/IProxyRequest';
import { IApiResponseProxy } from '../proxy/IProxyResponse';
import { ControllerDefaultRouteConfig } from './ControllerDefaultRouteConfig';
import { IProxiedRoute } from '../proxy/IProxiedRoute';

export interface IController {
  /**
   * Default Route Config
   * ---------------------
   * Set of default configurations that shall be used in all ApiRoutes
   * that resided inside this IApiController;
   * 
   * Notice that this are default configurations and can be overriden 
   * by an ApiRoute definition, to make sure all ApiRoutes follow
   * a set of configurations you should override
   * *transformRoute* method
   */
  readonly defaultRouteConfig: ControllerDefaultRouteConfig;

  /**
   * Base URL
   * --------
   * URL that will be preppended with forward slashes (posix join) 
   * to all ApiRoutes inside this controller
   * An empty base URL means that nothing shall be preppended!
   */
  readonly baseURL: string;

  /**
   * Transform Route
   * ----------------
   * Called when the ApiRoute is assigned to an adapter
   * 
   * The APIRoute object is passed and can be modified
   * before actually being assigned
   * 
   * Transform route, by default, is the responsible
   * for preppending baseURL of the ApiController
   * @param route 
   */
  transformRoute(route: IRoute): IRoute;

  /**
   * Request Proxies
   * ----------------
   * Return all Request Proxies of this ApiController
   */
  requestProxies(): IProxyRequest[];
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
  addRequestProxy(proxy: IProxyRequest): IController;
  /**
  * Remove Request Proxy
  * ---------------------
  * Removes a previously added Request Proxy
  * Trying to remove a proxy that is not included
  * in this controller will silently fail
  * @param proxy 
  */
  removeRequestProxy(proxy: IProxyRequest): IController;


  /**
  * Response Proxies
  * -----------------
  * Return all Response Proxies that for this controller
  * in the order they were added
  */
  responseProxies(): IApiResponseProxy[];
  /**
   * Add Response Proxy
   * -------------------
   * Add a new proxy that will receive the response from an APIResolver
   * which resides inside this controller
   * @param proxy 
   */
  addResponseProxy(proxy: IApiResponseProxy): IController;
  /**
   * Remove Response Proxy
   * ---------------------
   * Removes a prevuisly added proxy in this controller
   * Trying to remove a proxy that is not included
   * in this controller will silently fail
   * @param proxy 
   */
  removeResponseProxy(proxy: IApiResponseProxy): IController;


  /**
   * All Routes
   * ----------
   * Return all APIRoutes with the Request and Response
   * proxys from this ApiController
   */
  allRoutes(): IProxiedRoute[];

}