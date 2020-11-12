import { IProxiedRoute } from '../../../proxy/IProxiedRoute';
import { IRouteRequest } from '../../../request/IRouteRequest';
import { Maybe, MaybePromise } from '../../../error/Maybe';
import { ApiException } from '../../../error/ApiException';
import { ApiError } from '../../../error/ApiError';

export type FailedSchemaValidationPolicyFunction = (
  route: IProxiedRoute,
  request: IRouteRequest,
  origin: string,
  property: string,
  error: ApiException | ApiError
) => Maybe<true> | MaybePromise<true>; 