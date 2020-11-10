import { Maybe, MaybePromise } from 'error/Maybe';
import { IProxiedApiRoute } from 'proxy/IProxiedApiRoute';
import { IApiRouteRequest } from 'request/IApiRouteRequest';

export interface IRequestPipe {
  name: string;
  pipe: RequestPipeFunction;
}


export type RequestPipeFunction = (route: IProxiedApiRoute, request: IApiRouteRequest) => Maybe<true> | MaybePromise<true>;