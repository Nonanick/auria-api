import { Maybe, MaybePromise } from '../../error/Maybe';
import { IProxiedApiRoute } from '../../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../../request/IApiRouteRequest';

export type RequestPropertyCaster = (
  route: IProxiedApiRoute,
  request: IApiRouteRequest
) => Maybe<true> | MaybePromise<true>;