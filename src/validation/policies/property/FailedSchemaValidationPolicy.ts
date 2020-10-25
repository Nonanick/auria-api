import { IProxiedApiRoute } from '../../../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../../../request/IApiRouteRequest';
import { Maybe, MaybePromise } from '../../../error/Maybe';
import { ApiException } from '../../../error/ApiException';
import { ApiError } from '../../../error/ApiError';

export type FailedSchemaValidationPolicyFunction = (
  route: IProxiedApiRoute,
  request: IApiRouteRequest,
  origin: string,
  property: string,
  error: ApiException | ApiError
) => Maybe<true> | MaybePromise<true>; 