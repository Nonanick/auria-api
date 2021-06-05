import { IRoute } from '../route/route.type';
import { IProxyRequest } from './proxy_request.type';
import { IProxyResponse } from './proxy_response.type';
import { IController } from '../controller/controller.type';

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