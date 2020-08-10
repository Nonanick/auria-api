import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../request/IApiRouteRequest';
import { Maybe } from '../error/Maybe';

export type ValidateApiCallFunction = (route : IProxiedApiRoute, request : IApiRouteRequest) => Maybe<true> | Promise<Maybe<true>>; 