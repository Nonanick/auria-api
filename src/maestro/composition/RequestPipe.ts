import { Maybe, MaybePromise } from '../../error/Maybe';
import { IProxiedRoute } from '../../proxy/IProxiedRoute';
import { IRouteRequest } from '../../request/IRouteRequest';

export interface IRequestPipe {
  name: string;
  pipe: RequestPipeFunction;
}


export type RequestPipeFunction = (route: IProxiedRoute, request: IRouteRequest) => Maybe<true> | MaybePromise<true>;