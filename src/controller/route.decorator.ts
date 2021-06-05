import type { HTTPMethod } from '../route/http_method.type';
import type { IProxiedRoute } from '../proxy/proxied_route.type';
import type { Except } from 'type-fest';

export const apiRoutesSymbol = Symbol('ApiControllerRoutes');

/**
 * Register Api Route Params
 * -------------------------
 * 
 */
export type RegisterApiRouteParams = Omit<Partial<IProxiedRoute>, 'resolver'> & { url: string; };

/**
 * Register Api Route
 * -------------------
 * Add a class method/parameter as an ApiResolver
 * 
 * @param params 
 */
export function Route(params: RegisterApiRouteParams) {

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
			requestProxies: [],
			responseProxies: [],
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

export function GET(params : Except<RegisterApiRouteParams, "methods">) {

	return Route({
		...params,
		methods : 'get'
	})

}

export function POST(params : Except<RegisterApiRouteParams, "methods">) {

	return Route({
		...params,
		methods : 'post'
	})

}

export function PUT(params : Except<RegisterApiRouteParams, "methods">) {

	return Route({
		...params,
		methods : 'put'
	})

}

export function DELETE(params : Except<RegisterApiRouteParams, "methods">) {

	return Route({
		...params,
		methods : 'delete'
	})

}

export function PATCH(params : Except<RegisterApiRouteParams, "methods">) {

	return Route({
		...params,
		methods : 'patch'
	})

}

export function SEARCH(params : Except<RegisterApiRouteParams, "methods">) {

	return Route({
		...params,
		methods : 'search'
	})

}