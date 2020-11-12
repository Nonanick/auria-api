import { Maybe, MaybePromise } from '../../../error/Maybe';
import { IProxiedRoute } from '../../../proxy/IProxiedRoute';
import { IRouteRequest } from '../../../request/IRouteRequest';

export type RouteSchemaEnforcer = (
  route: IProxiedRoute,
  request: IRouteRequest
) => Maybe<true> | MaybePromise<true>;