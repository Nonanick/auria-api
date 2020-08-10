import { IApiRouteResponse } from '../response/IApiRouteResponse';
import { Maybe } from '../error/Maybe';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../request/IApiRouteRequest';

export type ApiCallResolver = (api : IProxiedApiRoute, request : IApiRouteRequest) => Promise<Maybe<IApiRouteResponse>>;