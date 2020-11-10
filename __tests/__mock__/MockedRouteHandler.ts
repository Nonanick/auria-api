import { ApiSendErrorFunction } from "../../src/maestro/ApiSendErrorFunction";
import { ApiSendResponseFunction } from "../../src/maestro/ApiSendResponseFunction";
import { IProxiedApiRoute } from "../../src/proxy/IProxiedApiRoute";
import { IApiRouteRequest } from "../../src/request/IApiRouteRequest";

export async function MockedRouteHandler(route: IProxiedApiRoute, request: IApiRouteRequest, sendResponse: ApiSendResponseFunction, sendError: ApiSendErrorFunction): Promise<void> {

}