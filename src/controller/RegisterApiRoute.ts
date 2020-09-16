import { IApiRoute } from '../route/IApiRoute';
import { HTTPMethod } from '../route/HTTPMethod';

export const apiRoutesSymbol = Symbol('ApiControllerRoutes');

/**
 * Register Api Route Params
 * -------------------------
 * 
 */
export type RegisterApiRouteParams = Omit<Partial<IApiRoute>, 'resolver'> & { url: string; };

/**
 * Register Api Route
 * -------------------
 * Add a class method/parameter as an ApiResolver
 * 
 * @param params 
 */
export function RegisterApiRoute(params: RegisterApiRouteParams) {

	return (target: any, propertyKey: string | symbol) => {
		let proto = target.constructor.prototype;

		if (proto[apiRoutesSymbol] == null) {
			proto[apiRoutesSymbol] = [];
		}

		// Prevent duplicated HTTP Methods
		if (Array.isArray(params.methods)) {
			let nonDupMethods: HTTPMethod[] = [];
			params.methods.forEach(m => nonDupMethods.includes(m) ? undefined : nonDupMethods.push(m));
			params.methods = nonDupMethods;
		}

		let defaultConfig = proto['defaultRouteConfig'] ?? {};
		let pushNewResolver = {
			...defaultConfig,
			...params,
			resolver: proto[propertyKey]
		};
		if (typeof pushNewResolver.resolver !== "function") {
			// Default resolver might
			pushNewResolver.resolver = propertyKey;

		}
		proto[apiRoutesSymbol].push(pushNewResolver);
	};
}
