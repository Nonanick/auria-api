import type { HTTPMethod } from '../route/http_method.type';
import type { IProxiedRoute } from '../proxy/proxied_route.type';
import type { Except } from 'type-fest';

export const ControllerRoutesSymbol = Symbol('ControllerRoutes');

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
		let proto = target;

		if (proto[ControllerRoutesSymbol] == null) {
			proto[ControllerRoutesSymbol] = {};
		}

		// Prevent duplicated HTTP Methods
		if (Array.isArray(params.methods)) {
			let nonDupMethods: HTTPMethod[] = [];
			params.methods.forEach(m => nonDupMethods.includes(m) ? undefined : nonDupMethods.push(m));
			params.methods = nonDupMethods;
		}

		let defaultConfig = proto['defaultRouteConfig'] ?? {};

		// If another route definition was set beforehand preserve its values
		let oldRouteParams = proto[ControllerRoutesSymbol][propertyKey] ?? {};

		let pushNewResolver = {
			requestProxies: [],
			responseProxies: [],
			...defaultConfig,
			...oldRouteParams,
			...params,
			resolver: proto[propertyKey]
		};

		if (typeof pushNewResolver.resolver !== "function") {
			// Default resolver might
			pushNewResolver.resolver = propertyKey;
		}

		proto[ControllerRoutesSymbol][propertyKey] = pushNewResolver;
	};
}

export function GET(params: Except<RegisterApiRouteParams, "methods"> | string) {
	let useParams: Except<RegisterApiRouteParams, "methods">;

	if (typeof params === "string") {
		useParams = {
			url: params
		}
	} else {
		useParams = params;
	}

	return Route({
		...useParams,
		methods: 'get'
	});

}

export function POST(params: Except<RegisterApiRouteParams, "methods"> | string) {

	let useParams: Except<RegisterApiRouteParams, "methods">;

	if (typeof params === "string") {
		useParams = {
			url: params
		}
	} else {
		useParams = params;
	}

	return Route({
		...useParams,
		methods: 'post'
	});

}

export function PUT(params: Except<RegisterApiRouteParams, "methods"> | string) {
	let useParams: Except<RegisterApiRouteParams, "methods">;

	if (typeof params === "string") {
		useParams = {
			url: params
		}
	} else {
		useParams = params;
	}

	return Route({
		...useParams,
		methods: 'put'
	});

}

export function DELETE(params: Except<RegisterApiRouteParams, "methods"> | string) {

	let useParams: Except<RegisterApiRouteParams, "methods">;

	if (typeof params === "string") {
		useParams = {
			url: params
		}
	} else {
		useParams = params;
	}

	return Route({
		...useParams,
		methods: 'delete'
	});

}

export function PATCH(params: Except<RegisterApiRouteParams, "methods"> | string) {

	let useParams: Except<RegisterApiRouteParams, "methods">;

	if (typeof params === "string") {
		useParams = {
			url: params
		}
	} else {
		useParams = params;
	}

	return Route({
		...useParams,
		methods: 'patch'
	});

}

export function SEARCH(params: Except<RegisterApiRouteParams, "methods"> | string) {

	let useParams: Except<RegisterApiRouteParams, "methods">;

	if (typeof params === "string") {
		useParams = {
			url: params
		}
	} else {
		useParams = params;
	}

	return Route({
		...useParams,
		methods: 'search'
	});

}