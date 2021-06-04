import { IRouteRequest } from '../request/IRouteRequest';
import { Maybe } from '../error/Maybe';
import { IRouteResponse } from '../response/IRouteResponse';

export type Handler = (request: IRouteRequest) => Maybe<IRouteResponse | any>;