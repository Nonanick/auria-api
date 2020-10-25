import { IProxiedApiRoute } from '../../../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../../../request/IApiRouteRequest';
import { Maybe, MaybePromise } from '../../../error/Maybe';

export type FailedSchemaValidationPolicyEnforcer = (
  route: IProxiedApiRoute,
  request: IApiRouteRequest
) => Maybe<true> | MaybePromise<true>; 