import { ApiEndpointNotAFunction } from '../../error/exceptions/ApiEndpointNotAFunction';
import { Maybe } from "../../error/Maybe";
import { IProxiedRoute } from "../../proxy/IProxiedRoute";
import { IProxyRequest } from "../../proxy/IProxyRequest";
import { IApiResponseProxy } from "../../proxy/IProxyResponse";
import { IRouteRequest } from "../../request/IRouteRequest";
import {
	IApiRouteResponse,
	implementsRouteResponse
} from "../../response/IRouteResponse";
import { RouteResponse } from "../../response/RouteResponse";
import { Resolver } from '../../route/Resolver';
import { RequestHandler } from '../composition/RequestHandler';

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

		let response: IApiRouteResponse;

		// Execute Function
		try {
			let resolver: Resolver;

			if (typeof route.resolver === 'function') {
				resolver = route.resolver;
			} else if (typeof route.resolver === 'string') {
				resolver = (route.controller as any)[route.resolver];
			}

			if (typeof resolver! !== "function") {
				throw new ApiEndpointNotAFunction("Route controller method " + route.resolver + " is not a function!");
			}

			let routineResponse = await resolver(request);
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

		let responseProxies: IApiResponseProxy[] = route.responseProxies;

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
	response: IApiRouteResponse,
	proxies: IApiResponseProxy[]
): Promise<Maybe<IApiRouteResponse>> {

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
