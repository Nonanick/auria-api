import { EventEmitter } from 'events';
import { IApiController } from '../controller/IApiController';
import { IApiRoute } from '../route/IApiRoute';
import { IApiRequestProxy } from '../proxy/IApiRequestProxy';
import { IApiResponseProxy } from '../proxy/IApiResponseProxy';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';

export interface IApiContainer extends EventEmitter {

  readonly baseURL : string;

  addController(controller : IApiController) : IApiContainer;
  removeController(controller : IApiController) : IApiContainer;
  controllers() : IApiController[];

  childContainers() : IApiContainer[];
  addChildContainer(container : IApiContainer) : IApiContainer;
  removeChildContainer(container : IApiContainer) : IApiContainer;

  requestProxies() : IApiRequestProxy[];
  addRequestProxy(proxy : IApiRequestProxy) : IApiContainer;
  removeRequestProxy(proxy : IApiRequestProxy) : IApiContainer;

  responseProxies() : IApiResponseProxy[];
  addResponseProxy(proxy : IApiResponseProxy) : IApiContainer;
  removeResponseProxy(proxy : IApiResponseProxy) : IApiContainer;
  
  allRoutes() : IProxiedApiRoute[];

}