import { Maybe, MaybePromise } from '../../error/maybe.type';
import { IProxiedRoute } from '../../proxy/proxied_route.type';
import { IRouteRequest } from '../../request/route_request.type';

export interface IRequestPipe {
  name: string;
  pipe: RequestPipeFunction;
}


export type RequestPipeFunction = (route: IProxiedRoute, request: IRouteRequest) => Maybe<true> | MaybePromise<true>;