import { IRoute } from '../route/IRoute';
import { IProxyRequest } from './IProxyRequest';
import { IProxyResponse } from './IProxyResponse';
import { IController } from '../controller/IController';

/**
 * IProxiedApiRoute
 * -----------------
 * 
 * ApiRoute with all of the assigned Request and Response proxies  
 * The Controller which hold the ApiRoute is also present, useful
 * when assigning a class property as the ApiRouteResolver
 */
export interface IProxiedRoute extends IRoute {

	readonly requestProxies: IProxyRequest[];

	readonly responseProxies: IProxyResponse[];

	readonly controller: IController;

}