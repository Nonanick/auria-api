import { IApiRoute } from '../route/IApiRoute';
import { IApiRequestProxy } from './IApiRequestProxy';
import { IApiResponseProxy } from './IApiResponseProxy';
import { IApiController } from '../controller/IApiController';

/**
 * IProxiedApiRoute
 * -----------------
 * 
 * ApiRoute with all of the assigned Request and Response proxies  
 * The Controller which hold the ApiRoute is also present, useful
 * when assigning a class property as the ApiRouteResolver
 */
export interface IProxiedApiRoute extends IApiRoute {

	readonly requestProxies: IApiRequestProxy[];

	readonly responseProxies: IApiResponseProxy[];

	readonly controller: IApiController;

}