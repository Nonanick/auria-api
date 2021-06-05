import { IRouteRequest } from '../request/route_request.type';
import { Maybe } from '../error/maybe.type';
import { IRouteResponse } from '../response/route_response.type';

export type Handler = (request: IRouteRequest) => Maybe<IRouteResponse | any>;