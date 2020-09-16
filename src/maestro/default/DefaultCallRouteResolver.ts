import { IProxiedApiRoute } from "../../proxy/IProxiedApiRoute";
import { IApiRouteRequest } from "../../request/IApiRouteRequest";
import { IApiRequestProxy } from "../../proxy/IApiRequestProxy";
import { ApiError } from "../../error/ApiError";
import { ApiException } from "../../error/ApiException";
import { ApiRouteResponse } from "../../response/ApiRouteResponse";
import {
	IApiRouteResponse,
	implementsApiRouteResponse,
} from "../../response/IApiRouteResponse";
import { IApiResponseProxy } from "../../proxy/IApiResponseProxy";
import { Maybe } from "../../error/Maybe";
import { ApiCallResolver } from '../../resolver/ApiCallResolver';
import { ApiRouteResolver } from '../../route/ApiRouteResolver';
import { RouteControllerNotAFunction } from '../../error/exceptions/RouteControllerNotAFunction';

export const DefaultCallRouteResolver: ApiCallResolver =
	async (
		route: IProxiedApiRoute,
		request: IApiRouteRequest
	) => {

		let requestProxies: IApiRequestProxy[] = route.requestProxies;

		// Handle Request Proxies
		let maybeRequest = await applyRequestProxies(request, requestProxies);
		// Any errors during request proxies?
		if (
			maybeRequest instanceof ApiError ||
			maybeRequest instanceof ApiException
		) {
			return maybeRequest;
		}
		request = maybeRequest;

		let response: IApiRouteResponse;

		// Execute Function
		try {
			let resolver: ApiRouteResolver;
			if (typeof route.resolver === 'function') {
				resolver = route.resolver;
			} else if (typeof route.resolver === 'string') {
				resolver = (route.controller as any)[route.resolver];
				if (typeof resolver != "function") {
					throw new RouteControllerNotAFunction("Route controller " + route.resolver + " is not a function!");
				}
			} else {
				throw new RouteControllerNotAFunction("Route controller " + route.resolver + " is not a function!");
			}

			let routineResponse = await resolver(request);
			// Resolve promised value, while return is a promise
			while (routineResponse instanceof Promise) {
				routineResponse = await routineResponse;
			}

			// Route might return an ApiRouteResponse for greater control of the output
			if (
				routineResponse instanceof ApiRouteResponse ||
				implementsApiRouteResponse(routineResponse)
			) {
				response = routineResponse;
			}
			// Return a default ApiRouteResponse with the routine response as the payload
			else {
				response = {
					exitCode: "OK",
					payload: routineResponse,
					status: 201,
					commands: [],
				};
			}
		} catch (err) {
			// In any Api Error is generated pass through as a return (Maybe<>) else throw it
			if (err instanceof ApiError || err instanceof ApiException) {
				return err;
			} else {
				throw err;
			}
		}

		let responseProxies: IApiResponseProxy[] = route.responseProxies;
		// Handle response proxies
		let maybeResponse = await applyResponseProxies(response, responseProxies);
		// Any errors during response proxies ?
		if (
			maybeResponse instanceof ApiException ||
			maybeResponse instanceof ApiError
		) {
			return maybeResponse;
		}

		response = maybeResponse;
		return response;
	};

async function applyRequestProxies(
	request: IApiRouteRequest,
	proxies: IApiRequestProxy[]
): Promise<Maybe<IApiRouteRequest>> {
	for (let proxy of proxies) {
		try {
			let proxiedRequest = await proxy.apply(request);
			if (
				proxiedRequest instanceof ApiError ||
				proxiedRequest instanceof ApiException
			) {
				return proxiedRequest;
			}
			request = proxiedRequest;
		} catch (err) {
			if (err instanceof ApiError || err instanceof ApiException) {
				return err;
			} else {
				throw err;
			}
		}
	}

	return request;
}

async function applyResponseProxies(
	response: IApiRouteResponse,
	proxies: IApiResponseProxy[]
): Promise<Maybe<IApiRouteResponse>> {
	for (let proxy of proxies) {
		try {
			let proxiedResponse = await proxy.apply(response);
			if (
				proxiedResponse instanceof ApiError ||
				proxiedResponse instanceof ApiException
			) {
				return proxiedResponse;
			}
			response = proxiedResponse;
		} catch (err) {
			if (err instanceof ApiError || err instanceof ApiException) {
				return err;
			} else {
				throw err;
			}
		}
	}

	return response;
}
