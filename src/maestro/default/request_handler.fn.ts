import type { Maybe } from "../../error/maybe.type";
import type { IProxiedRoute } from "../../proxy/proxied_route.type";
import type { IProxyRequest } from "../../proxy/proxy_request.type";
import type { IProxyResponse } from "../../proxy/proxy_response.type";
import type { IRouteRequest } from "../../request/route_request.type";
import type { IRouteResponse } from "../../response/route_response.type";
import type { InjectableHandler } from '../../route/injectable_handler.type';
import type { Handler } from '../../route/handler.type';
import type { RequestHandler } from '../composition/request_handler.type';
import { ApiEndpointNotAFunction } from '../../error/exceptions/api_endpoint_not_a_function.error';
import { RouteResponse } from "../../response/route_response.class";
import { isInjectableHandler, HandlerInjectorSymbol } from '../../route/injectable_handler.type';
import { implementsRouteResponse } from "../../response/route_response.type";

/**
 * RouteResolver
 * ------------------------
 * 
 * A default implementation to the ApiRequestHandler
 * 
 * @param route 
 * @param request 
 */
export const MaestroRequestHandler: RequestHandler =
	async (
		route: IProxiedRoute,
		request: IRouteRequest
	) => {

		let requestProxies: IProxyRequest[] = route.requestProxies;
		let maybeProxiedRequest = await applyRequestProxies(request, requestProxies);

		// Any errors during request proxies?
		if (maybeProxiedRequest instanceof Error) {
			return maybeProxiedRequest;
		}
		request = maybeProxiedRequest;

		let response: IRouteResponse;

		// Execute Function
		try {
			let handler: Handler;

			if (typeof route.resolver === 'function') {
				handler = route.resolver;
			} else if (typeof route.resolver === 'string') {
				handler = (route.controller as any)[route.resolver];
			}

			if (typeof handler! !== "function") {
				throw new ApiEndpointNotAFunction("Route controller method " + route.resolver + " is not a function!");
			}

			let routineResponse: any;

			// Has argument injections?
			if (isInjectableHandler(handler)) {
				let handlerWithInjectedArgs: InjectableHandler = handler;
				let injectedArgs: any[] = await Promise.all(
					handler[HandlerInjectorSymbol].map(
						async inject => {
							return await inject(route, request);
						}
					)
				);
				routineResponse = await handlerWithInjectedArgs(...injectedArgs);
			}
			// If not resolve it passing the request
			else {
				routineResponse = await handler(request);
			}
			// Resolve promised value, while return is a promise
			while (routineResponse instanceof Promise) {
				routineResponse = await routineResponse;
			}

			// Return generated errors
			if (
				routineResponse instanceof Error) {
				return routineResponse;
			}

			// Route might return an ApiRouteResponse for greater control of the output
			if (
				routineResponse instanceof RouteResponse ||
				implementsRouteResponse(routineResponse)
			) {
				response = routineResponse;
			}
			// Return a default ApiRouteResponse with the routine response as the payload
			else {
				response = {
					request,
					exitCode: "OK",
					payload: routineResponse,
					status: 201,
					commands: [],
				};
			}
		} catch (err) {
			return err;
		}

		let responseProxies: IProxyResponse[] = route.responseProxies;

		// Return proxied response
		return await applyResponseProxies(response, responseProxies);

	};

async function applyRequestProxies(
	request: IRouteRequest,
	proxies: IProxyRequest[]
): Promise<Maybe<IRouteRequest>> {
	for (let proxy of proxies) {
		try {
			let proxiedRequest = await proxy.apply(request);
			if (
				proxiedRequest instanceof Error
			) {
				return proxiedRequest;
			}
			request = proxiedRequest;
		} catch (err) {
			return err;
		}
	}

	return request;
}

async function applyResponseProxies(
	response: IRouteResponse,
	proxies: IProxyResponse[]
): Promise<Maybe<IRouteResponse>> {

	// Response proxies go from last to first added ???
	let reversedProxies = [...proxies].reverse();

	for (let proxy of reversedProxies) {
		try {
			let proxiedResponse = await proxy.apply(response);
			if (
				proxiedResponse instanceof Error
			) {
				return proxiedResponse;
			}
			response = proxiedResponse;
		} catch (err) {
			return err;
		}
	}

	return response;
}
