import { IApiRoute } from '../route/IApiRoute';
import { IApiRequestProxy } from './IApiRequestProxy';
import { IApiResponseProxy } from './IApiResponseProxy';

export interface IProxiedApiRoute extends IApiRoute {
  
  readonly requestProxies : IApiRequestProxy[];

  readonly responseProxies : IApiResponseProxy[];

}