import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../request/IApiRouteRequest';
import { Maybe } from '../error/Maybe';

export type ValidateApiCallRoutine = (route : IProxiedApiRoute, request : IApiRouteRequest) => Maybe<true | string>; 