import { Maybe, MaybePromise } from '../../../error/Maybe';
import { IProxiedRoute } from '../../../proxy/IProxiedRoute';
import { IRouteRequest } from '../../../request/IRouteRequest';

export type FailedSchemaValidationPolicyFunction = (
  route: IProxiedRoute,
  request: IRouteRequest,
  origin: string,
  property: string,
  error: Error
) => Maybe<true> | MaybePromise<true>; 