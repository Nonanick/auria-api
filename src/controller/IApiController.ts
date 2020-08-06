import { IApiRoute } from '../route/IApiRoute';
import { IApiRequestProxy } from '../proxy/IApiRequestProxy';
import { IApiResponseProxy } from '../proxy/IApiResponseProxy';
import { ApiControllerDefaultRouteConfig } from './ApiControllerDefaultRouteConfig';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';

export interface IApiController {
  readonly defaultRouteConfig : ApiControllerDefaultRouteConfig;
  
  readonly baseURL : string;

  transformRoute(route : IApiRoute) : IApiRoute;
  
  requestProxies() : IApiRequestProxy[];
  addRequestProxy(proxy : IApiRequestProxy) : IApiController;
  removeRequestProxy(proxy : IApiRequestProxy) : IApiController;

  responseProxies() : IApiResponseProxy[];
  addResponseProxy(proxy : IApiResponseProxy) : IApiController;
  removeResponseProxy(proxy : IApiResponseProxy) : IApiController;
  
  allRoutes() : IProxiedApiRoute[];

}