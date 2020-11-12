import { IRouteRequest } from '../request/IRouteRequest';
import { Maybe } from '../error/Maybe';
import { IApiRouteResponse } from '../response/IRouteResponse';

export type Resolver = (request: IRouteRequest) => Maybe<IApiRouteResponse | any>;