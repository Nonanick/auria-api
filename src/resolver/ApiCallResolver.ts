import { IApiRouteResponse } from '../response/IApiRouteResponse';
import { Maybe } from '../error/Maybe';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../request/IApiRouteRequest';
import { ApiSendResponseFunction } from '../maestro/ApiSendResponseFunction';
import { ApiSendErrorFunction } from '../maestro/ApiSendErrorFunction';

export type ApiCallResolver = (api : IProxiedApiRoute, request : IApiRouteRequest, sendResponse : ApiSendResponseFunction, sendError : ApiSendErrorFunction) => Promise<Maybe<IApiRouteResponse>>;