import { IApiRouteRequest } from '../request/IApiRouteRequest';
import { Maybe } from '../error/Maybe';
import { IApiRouteResponse } from '../response/IApiRouteResponse';

export type ApiRouteResolver = (request : IApiRouteRequest) => Maybe<IApiRouteResponse | any>;